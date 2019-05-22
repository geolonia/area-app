import 'babel-polyfill';
import turfArea from '@turf/area'

const areaDome = 46755

const map = new tilecloud.Map( document.querySelector( '#map' ) )

const clickFeature = event => {
  map.queryRenderedFeatures( { layters: map.getStyle().layers } ).forEach( feature => {
    map.setFeatureState( feature, { hover: false } )
  } )

  const features = map.queryRenderedFeatures( event.point )
  for ( let i = 0; i < features.length; i++ ) {
    const feature = features[ i ]
    if ( 'fill' === feature.layer.type ) {
      feature.layer.paint["fill-color"] = "#ff0000"
      map.setFeatureState( feature, { hover: true } )

      const area = turfArea( feature.geometry ).toFixed( 1 )
      const asDome = ( area / areaDome ).toFixed( 4 )

      console.log(feature)

      new mapboxgl.Popup()
        .setLngLat( event.lngLat )
        .setHTML( `この建物の面積は ${area}㎡ で、東京ドーム ${asDome} 個分の面積です。` )
        .addTo( map );

      break;
    }
  }
}

const mouseEnter = () => {
  map.getCanvas().style.cursor = 'pointer'
}

const mouseLeave = () => {
  map.getCanvas().style.cursor = ''
}

map.on( 'load', () => {
  map.getStyle().layers.forEach( (item) => {
    map.on('click', item.id, clickFeature)
    map.on('mouseenter', item.id, mouseEnter)
    map.on('mouseleave', item.id, mouseLeave)

    if ( 'fill' === item.type ) {
      const color = map.getPaintProperty( item.id, 'fill-color' )
      let opacity = map.getPaintProperty( item.id, 'fill-opacity' )
      if ( 'undefined' === typeof opacity ) {
        opacity = 1
      }

      if ( color ) {
        map.setPaintProperty( item.id, 'fill-color', ["case",
          ["boolean", ["feature-state", "hover"], false],
          "#ff0000",
          color
        ] );
      }

      if ( opacity ) {
        map.setPaintProperty( item.id, 'fill-opacity', ["case",
          ["boolean", ["feature-state", "hover"], false],
          0.2,
          parseFloat( opacity )
        ] );
      }
    }
  })
} )
