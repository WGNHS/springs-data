
const colorRange = {

'Conductivity_uS': [
     'var(--map-bin-blue-0)',
     'var(--map-bin-blue-1)',
     'var(--map-bin-blue-2)',
     'var(--map-bin-blue-3)',
     'var(--map-bin-blue-4)',
     'var(--map-bin-blue-5)',
     'var(--map-bin-blue-6)'
   ], 
'Discharge_cfs': [
     'var(--map-bin-purple-0)',
     'var(--map-bin-purple-1)',
     'var(--map-bin-purple-2)',
     'var(--map-bin-purple-3)',
     'var(--map-bin-purple-4)',
     'var(--map-bin-purple-5)',
     'var(--map-bin-purple-6)'
   ], 
'Water_Temp_C':[
     'var(--map-bin-green-0)',
     'var(--map-bin-green-1)',
     'var(--map-bin-green-2)',
     'var(--map-bin-green-3)',
     'var(--map-bin-green-4)',
     'var(--map-bin-green-5)',
     'var(--map-bin-green-6)'
   ], 
   'pH':  [
     'var(--map-bin-brown-0)',
     'var(--map-bin-brown-1)',
     'var(--map-bin-brown-2)',
     'var(--map-bin-brown-3)',
     'var(--map-bin-brown-4)',
     'var(--map-bin-brown-5)',
     'var(--map-bin-brown-6)'
   ]

};

const binRanges = {
  'Conductivity_uS': [
    [],
    [],
    [0, 300],
    [300, 502],
    [502, 676],
    [676, 926],
    [926, 2000]
  ],
  'Discharge_cfs': [
    [0.1, 0.2],
    [0.2, 0.5],
    [0.5, 1.0],
    [1, 2],
    [2, ],
    [2, 5],
    [5, 20]
  ], 
   'Water_Temp_C': [
    [5,6],
    [6,7],
    [7,8],
    [8, 9],
    [9, 10],
    [10, 13],
    [13, 17]
   ], 
   'pH':[
    [],
    [5.5, 6.5],
    [6.5, 7],
    [7, 7.5],
    [7.5, 8],
    [8, 9],
    [9, 10]
   ]
}
export const RestylingCircleMarker = L.CircleMarker.extend({
  getEvents: function() {
    return {
      zoomend: this._restyle,
      normalpoints: this._normal,
      typepoints: this._orifice,
      condpoints: this._conductivity,
      qpoints: this._discharge
    }
  },
  _restyle: function(e) {
    this.setRadius(RestylingCircleMarker.calcRadius(e.target.getZoom()))
  },
  _normal: function() {
    let color = 'var(--map-symbol)';
    if (!this._activeBackup) {
      this.setStyle({'color': color});
    } else {
      this._activeBackup = color;
    }
  },
  _orifice: function() {
    var color = 'var(--map-symbol)';
    var prop = 'Orifice_Geom';
    if (this.feature.properties[prop] === 'seepage/filtration') {
      color = 'var(--map-symbol-alt)';
    }
    if (!this._activeBackup) {
      this.setStyle({'color': color});
    } else {
      this._activeBackup = color;
    }
  },
  _conductivity: function() {
    var prop = 'Conductivity_uS';
    this._binPoint(prop);
  },
  _discharge: function() {
    var prop = 'Discharge_cfs';
    this._binPoint(prop);
  },
  _binPoint: function(prop) {
    let result = RestylingCircleMarker.binPoint(prop, this.feature.properties);
    if (!this._activeBackup) {
      this.setStyle({'color': result});
    } else {
      this._activeBackup = result;
    }
  },
  highlight: function() {
    this._activeBackup = this.options.color;
    this.setStyle({'color': 'var(--map-symbol-active'})
  },
  removeHighlight: function() {
    if (this._activeBackup) {
      this.setStyle({'color': this._activeBackup})
      this._activeBackup = null;
    }
  }
});

RestylingCircleMarker.calcRadius = (a) => Math.max(Math.floor(a/1.5),3);
RestylingCircleMarker.binPoint = (prop, data) => {
  let result = "#406058";
  const ranges = binRanges[prop];
  if (ranges) {
    const val = data[prop];
    for (let i = 0; i < ranges.length; i++) {
      if (ranges[i] && val > ranges[i][0] && val <= ranges[i][1]) {
        result = colorRange[prop][i];
      }
    }
  }
  return result;
}