import 'ol'
// import {Map, View} from 'ol'
// import * as olControl from 'ol/control'
//
// import olLayerTile from 'ol/layer/Tile'
// import olLayerVector from 'ol/layer/Vector'
//
// import olXYZ from 'ol/source/XYZ'
// import olOSM from 'ol/source/OSM'
import olSourceVector from 'ol/source/Vector'
// import olSourceTileDebug from 'ol/source/TileDebug'

import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'

import olStyleStyle from 'ol/style/Style'
// import olStyleIcon from 'ol/style/Icon'
// import olStyleStroke from 'ol/style/Stroke'
import olStyleText from 'ol/style/Text'
import olStyleFill from 'ol/style/Fill'

// import olInteractionDraw from 'ol/interaction/Draw'
//
// import localLogoImage from '../../assets/logo.png'


export default {
    // measureAngle(state) {
    //     let distanceOfPoints = (pointA, pointB) => {
    //         return Math.sqrt(Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2))
    //     }
    //     window.console.log('1')
    //
    //     state.commit('ADD_ANGLE_LAYER',state)
    //     window.console.log(state.lineDraw)
    //
    //     state.lineDraw.on('drawend', function (event) {
    //         let linePoints = event.feature.getGeometry().getCoordinates()
    //         let aPoint = linePoints[0];
    //         let bPoint = linePoints[1];
    //         let cPoint = linePoints[2];
    //         let ALine = distanceOfPoints(bPoint, cPoint);
    //         let BLine = distanceOfPoints(aPoint, cPoint);
    //         let CLine = distanceOfPoints(aPoint, bPoint);
    //         let angleB = Math.acos((Math.pow(ALine, 2) + Math.pow(CLine, 2) - Math.pow(BLine, 2)) / (2 * ALine * CLine));
    //         let angleContent = "angleB:" + (180 * angleB / Math.PI).toFixed(2);
    //         state.commit('ADD_WORD')
    //         // wordAnchor(bPoint, angleContent)
    //         window.console.log(angleContent);
    //         state.map.removeInteraction(state.lineDraw);
    //     });
    //
    //     state.map.addInteraction(state.lineDraw);
    // },
    // wordAnchor(state, payload) {
    //
    // }
}