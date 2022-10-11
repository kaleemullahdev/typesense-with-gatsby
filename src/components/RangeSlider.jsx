import React, { useState, useEffect } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { useConnector } from "react-instantsearch-hooks-web";
import connectRange from "instantsearch.js/es/connectors/range/connectRange";

export function useRangeSlider(props) {
  return useConnector(connectRange, props);
}

export const RangeSlider = (props) => {
  const sliderProps = useRangeSlider(props);
  return <PriceSlider {...sliderProps} />;
};

export function formatNumber(value) {
  return Number(value).toLocaleString();
}

function Handle({
  domain: [min, max],
  handle: { id, value, percent },
  disabled,
  getHandleProps,
}) {
  return (
    <>
      {/* Dummy element to make the tooltip draggable */}
      <div
        style={{
          position: "absolute",
          left: `${percent}%`,
          width: 40,
          height: 25,
          transform: "translate(-50%, -100%)",
          cursor: disabled ? "not-allowed" : "grab",
          zIndex: 1,
        }}
        aria-hidden={true}
        {...getHandleProps(id)}
      />
      <div
        role="slider"
        className="slider-handle"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
          cursor: disabled ? "not-allowed" : "grab",
        }}
        {...getHandleProps(id)}
      />
    </>
  );
}

export const PriceSlider = ({ refine, range, canRefine }) => {
  const [ticksValues, setTicksValues] = useState([range.min, range.max]);
  useEffect(() => {
    setTicksValues([range.min, range.max]);
  }, [range?.min, range?.max]);

  const onChange = (values) => {
    if (range.min !== values[0] || range.max !== values[1]) {
      refine(values);
    }
  };

  if (
    !canRefine ||
    ticksValues[0] === undefined ||
    ticksValues[1] === undefined
  ) {
    return null;
  }

  return (
    <>
      <Slider
        mode={2}
        step={1}
        domain={[range?.min, range?.max]}
        values={[range.min, range.max]}
        disabled={!canRefine}
        onChange={onChange}
        onUpdate={setTicksValues}
        rootStyle={{ position: "relative" }}
        className="ais-RangeSlider my-14"
      >
        <Rail>
          {({ getRailProps }) => (
            <div className="slider-rail" {...getRailProps()} />
          )}
        </Rail>

        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div>
              {tracks.map(({ id, source, target }) => (
                <div
                  key={id}
                  className="slider-track"
                  style={{
                    left: `${source.percent}%`,
                    width: `${target.percent - source.percent}%`,
                  }}
                  {...getTrackProps()}
                />
              ))}
            </div>
          )}
        </Tracks>

        <Handles>
          {({ handles, getHandleProps }) => (
            <div>
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={[range?.min, range?.max]}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>

        <Ticks values={ticksValues}>
          {({ ticks }) => (
            <div>
              {ticks.map(({ id, count, value, percent }) => (
                <div
                  key={id}
                  className="slider-tick"
                  style={{
                    marginLeft: `${-(100 / count) / 2}%`,
                    width: `${100 / count}%`,
                    left: `${percent}%`,
                  }}
                >
                  {/* <span style={{ color: "#e2a400", marginRight: 4 }}>$</span> */}
                  {formatNumber(value)}
                </div>
              ))}
            </div>
          )}
        </Ticks>
      </Slider>
    </>
  );
};
