/** @jsx jsx */
import { React, AllWidgetProps, css, jsx } from "jimu-core";
import {
  loadArcGISJSAPIModules,
  JimuMapViewComponent,
  JimuLayerViewComponent,
  JimuMapView,
  JimuLayerView
} from "jimu-arcgis";
import { Button } from 'jimu-ui';
import { IMConfig } from "../config";

import defaultMessages from "./translations/default";

interface IState {
  jimuMapView: JimuMapView;
  layerViews: Array<JimuLayerView>;
}

export default class Widget extends React.PureComponent<
  AllWidgetProps<IMConfig>,
  IState
  > {


  state = {
    jimuMapView: null,
    layerViews: []
  };

  setLayerExpression = (expression, layer) => {
    console.log(expression, layer);
    const layerView = this.state.jimuMapView.jimuLayerViews[layer];
    if (layerView) {
      layerView.view.layer.definitionExpression = expression;
    }
  };

  render() {
    const style = css`
      form > div {
        display: flex;
        justify-content: space-between;
        input {
          width: 100%;
        }
        button {
          min-width: 100px;
        }
      }
    `;
    return (
      <div className="widget-addLayers jimu-widget p-2" css={style}>
        {this.props.hasOwnProperty("useMapWidgetIds") &&
          this.props.useMapWidgetIds &&
          this.props.useMapWidgetIds.length === 1 && (
            <JimuMapViewComponent
              useMapWidgetIds={this.props.useMapWidgetIds}
              onActiveViewChange={(jmv: JimuMapView) => {
                this.setState({
                  jimuMapView: jmv,
                });
              }}
            />
          )}

        {this.props.hasOwnProperty("jimuLayerViewInfo") && this.props.jimuLayerViewInfo &&
          (
            <JimuLayerViewComponent
              jimuLayerViewInfo={this.props.jimuLayerViewInfo}
              useMapWidgetIds={this.props.useMapWidgetIds}
              onLayerViewFailed={(err: any) => {
                console.log(err);
              }}
              onLayerViewCreated={(jmlv: JimuLayerView) => {
                //   this.setState({
                //     jimuLayerView: jmlv,
                //   });
                //   let found = false;
                //   for (let i = 0; i < this.state.layerViews.length; i++) {
                //     console.log(jmlv.jimuLayerId, this.state.layerViews[i].id);
                //     if (jmlv.jimuLayerId === this.state.layerViews[i].id) {
                //       found = true;
                //       break;
                //     }
                //   }

                //   if (!found) {
                //     const layerViews = [
                //       [{ id: jmlv.jimuLayerId, layer: jmlv }],
                //       ...this.state.layerViews
                //     ];

                //     this.setState({ layerViews: layerViews });
                //   }
              }}

            />
          )}

        {!this.props.useMapWidgetIds || !this.props.jimuLayerViewInfo && <p>{defaultMessages.instructions}</p>}

        <div>
          {this.props.config.configuredButtons.map((btn) => (
            <Button
              style={{ margin: `${this.props.config.buttonMargins}` }}
              type={this.props.config.buttonType}
              size={this.props.config.buttonSize}
              onClick={(e) => {
                this.setLayerExpression(btn.expression, btn.layer)
              }}>{btn.label}</Button>
          ))}

        </div>

        {/* {this.props.config.configuredButtons && this.props.config.configuredButtons.map((btn) => {
          return

          <Button onClick={(e) => {
            this.setLayerExpression(btn.expression, btn.layer)
          }} type="primary" size="sm">{btn.label}</Button>

        })} */}
      </div>
    );
  }
}
