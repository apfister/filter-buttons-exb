/** @jsx jsx */
import { React, FormattedMessage, css, jsx, styled } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import { Button, Switch, Select, Option, TextInput } from "jimu-ui";
import IMJimuLayerViewInfo, { FeatureLayerDataSource } from 'jimu/arcgis';
import {
  JimuMapViewSelector,
  JimuLayerViewSelector,
  SettingSection,
  SettingRow
} from "jimu-ui/setting-components";
import { IMConfig } from "../config";
import defaultMessages from "./translations/default";

interface IState {
  selectedLayerInfo: IMJimuLayerViewInfo
}

const StyledSettingRow = styled(SettingRow)`
  flex-direction: column;
  align-items: stretch !important;
  padding: 10px;
  &:hover {
    background-color: rgba(128, 128, 128, 0.25);
  }
`;

export default class Setting extends React.PureComponent<
  AllWidgetSettingProps<IMConfig>,
  any
  > {

  state = {
    selectedLayerInfo: null,
    btnMargins: 5
  };

  constructor(props) {
    super(props);

    this.props.config.set('useMapWidgetIds', this.props.config.useMapWidgetIds);
    this.props.config.set('jimuLayerViewInfo', this.props.config.jimuLayerViewInfo);
  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.config.set('useMapWidgetIds', useMapWidgetIds);
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  };

  onLayerWidgetSelected = (jimuLayerViewInfo: IMJimuLayerViewInfo) => {
    this.setState({ selectedLayerInfo: jimuLayerViewInfo });
    this.props.config.set('jimuLayerViewInfo', jimuLayerViewInfo);
    this.props.onSettingChange({
      id: this.props.id,
      jimuLayerViewInfo: jimuLayerViewInfo
    });
  };

  onLabelInputChange = (newText, filterId) => {
    const btns = [...this.props.config.configuredButtons];
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].id === filterId) {
        btns[i].label = newText;
        break;
      }
    }
    // this.setState({ configuredButtons: btns });
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('configuredButtons', btns)
    });
  };

  onTextInputChange = (newText, filterId) => {
    const btns = [...this.props.config.configuredButtons];
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].id === filterId) {
        btns[i].expression = newText;
        break;
      }
    }
    // this.setState({ configuredButtons: btns });
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('configuredButtons', btns)
    });
  };

  removeFilterButton = (btnId) => {
    let ind = -1;
    const currentBtns = [...this.props.config.configuredButtons]
    currentBtns.forEach((btn, i) => {
      if (btn.id === btnId) {
        console.log(btn);
        ind = i;
      }
    });

    currentBtns.splice(ind, 1);

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('configuredButtons', currentBtns)
    });
  };

  onAddButtonClick = () => {
    const layerId = `${this.state.selectedLayerInfo.jimuMapViewId}-${this.state.selectedLayerInfo.jimuLayerId}`
    const newButtons = [
      {
        id: Math.random(),
        label: 'My Layer Filter Name',
        layer: layerId,
        expression: "1=1"
      }
    ]

    let btns = [...this.props.config.configuredButtons];
    btns.push(newButtons);

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('configuredButtons', btns)
    });
  };

  updateButtonProp = (propName, propValue) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(propName, propValue)
    });
  };

  render() {
    const style = css`
      .widget-setting-addLayers {
        .checkbox-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
      }
    `;

    const spacer = css`
      .spacer {
        margin-bottom: 10px;
      }
    `;

    const deleteBtn = css`
      margin-bottom: 5px;
      margin-top: 5px;
    `;

    return (
      <div css={style}>
        <div className="widget-setting-addLayers">
          <SettingSection
            className="map-selector-section"
            title={this.props.intl.formatMessage({
              id: "mapWidgetLabel",
              defaultMessage: defaultMessages.selectMapWidget
            })}
          >
            <SettingRow>
              <JimuMapViewSelector
                onSelect={this.onMapWidgetSelected}
                useMapWidgetIds={this.props.useMapWidgetIds}
              />
            </SettingRow>

          </SettingSection>
          <SettingSection
            className="map-selector-section"
            title={this.props.intl.formatMessage({
              id: "layerWidgetLabel",
              defaultMessage: defaultMessages.selectLayerWidget
            })}
          >
            <SettingRow>
              <JimuLayerViewSelector
                onSelect={this.onLayerWidgetSelected}
                jimuLayerViewInfo={this.props.jimuLayerViewInfo}
                useMapWidgetIds={this.props.useMapWidgetIds}
              />
            </SettingRow>
          </SettingSection>

          <SettingSection title="Button Style Options">
            <SettingRow>
              Margins <TextInput onChange={(e) => {
                this.updateButtonProp('buttonMargins', e.target.value);
              }} defaultValue={this.props.config.buttonMargins} />
            </SettingRow>
            <SettingRow>
              Button Size
            <Select
                value={this.props.config.buttonSize}
                onChange={(e) => {
                  this.updateButtonProp('buttonSize', e.target.value);
                }}>
                <Option value="sm">Small</Option>
                <Option value="md">Medium</Option>
                <Option value="lg">Large</Option>
              </Select>
            </SettingRow>
            <SettingRow>
              Button Type
              <Select
                value={this.props.config.buttonType}
                onChange={(e) => {
                  this.updateButtonProp('buttonType', e.target.value);
                }}>
                <Option value="primary">Primary</Option>
                <Option value="secondary">Secondary</Option>
                <Option value="tertiary">Tertiary</Option>
                <Option value="danger">Danger</Option>
                <Option value="link">Link</Option>
              </Select>
            </SettingRow>
          </SettingSection>

          <SettingSection
            title={this.props.intl.formatMessage({
              id: "addButtonLabel",
              defaultMessage: defaultMessages.addButton
            })}
          >

            <SettingRow>
              <Button className="w-100 my-3" disabled={!this.props.useMapWidgetIds || !this.props.jimuLayerViewInfo} onClick={this.onAddButtonClick} type="primary" size="sm">Add Filter</Button>
            </SettingRow>

            {this.props.config.configuredButtons.map((btn) => {
              return (
                <StyledSettingRow>
                  Name<TextInput onChange={(e) => {
                    this.onLabelInputChange(e.target.value, btn.id);
                  }} defaultValue={btn.label} />
                 Def. Expr. <TextInput onChange={(e) => {
                    this.onTextInputChange(e.target.value, btn.id);
                  }} defaultValue={btn.expression} />
                  <Button type="danger" css={deleteBtn} onClick={() => {
                    this.removeFilterButton(btn.id);
                  }}>Delete</Button>
                </StyledSettingRow>
              )
            })}

          </SettingSection>
        </div>
      </div>
    );
  }
}
