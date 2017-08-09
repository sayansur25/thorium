import React from "react";
import Views from "../../views";
import { withApollo } from "react-apollo";
import "./layout.scss";
import "./theme.scss";

const Viewscreen = withApollo(props => {
  let { simulator, station } = props;
  let alertClass = `alertColor${simulator.alertlevel || 5}`;
  return (
    <div className="viewscreen">
      <div className={`card-container card-area ${alertClass}`}>
        <Views.Viewscreen {...props} />
      </div>
      <div id="curve-frame" className={alertClass}>
        <div className="frame-color">
          <div className="part-3" />
          <div className="part-3 opposite" />
        </div>
        <div className="frame-image">
          <div className="frame-3 opposite" />
          <div className="frame-3" />
        </div>
        <div className="frame-text">
          <h1 className="simulator-name">
            {simulator.name}
          </h1>
          <h2 className="station-name">
            {station.name}
          </h2>
        </div>
      </div>
    </div>
  );
});

export default Viewscreen;
