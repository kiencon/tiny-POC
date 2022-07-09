import React, { useState, useEffect, useRef } from 'react';
import '../../index.css';
import Moveable from "react-moveable";
import { Frame } from "scenejs";

const DemoMoveable1 = () => {
  const [state, setState] = useState({
    target: null,
    container: null,
    scalable: true,
    resizable: false,
    warpable: false
  });

  const [frame, setFrame] = useState(new Frame({
    width: "250px",
    height: "200px",
    left: "0px",
    top: "0px",
    transform: {
      rotate: "0deg",
      scaleX: 1,
      scaleY: 1,
      matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }
  }))

  const ref = useRef(null);
  const moveableObjectRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    setState({
      target: ref.current
    });
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize");
    };
  }, []);

  const clickWarpable = () => setState({
    ...state,
    resizable: false,
    scalable: false,
    warpable: true,
  });

  const clickScalable = () => {
    setState({
      ...state,
      warpable: false,
      resizable: false,
      scalable: true,
    });
  };

  const clickResizable = () => setState({
    ...state,
    warpable: false,
    scalable: false,
    resizable: true,
  });

  const onWindowResize = () => {
    moveableObjectRef.current.updateRect();
  };

  const setTransform = target => {
    target.style.cssText = frame.toCSS();
  }

  const setLabel = (clientX, clientY, text) => {
    labelRef.current.style.cssText = `
      display: block; 
      transform: 
        translate(${clientX}px, ${clientY - 10}px)
        translate(-100%, -100%) translateZ(-100px);`;
    labelRef.current.innerHTML = text;
  }

  const onDrag = ({ target, clientX, clientY, top, left, isPinch }) => {
    setFrame(frame.set("left", `${left}px`));
    setFrame(frame.set("top", `${top}px`));
    setTransform(target);
    if (!isPinch) {
      setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
    }
  };

  const onResize = ({ target, clientX, clientY, width, height, isPinch }) => {
    setFrame(frame.set("width", `${width}px`));
    setFrame(frame.set("height", `${height}px`));
    setTransform(target);
    if (!isPinch) {
      setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
    }
  };

  const onScale = ({ target, delta, clientX, clientY, isPinch }) => {
    const scaleX = frame.get("transform", "scaleX") * delta[0];
    const scaleY = frame.get("transform", "scaleY") * delta[1];
    setFrame(frame.set("transform", "scaleX", scaleX));
    setFrame(frame.set("transform", "scaleY", scaleY));
    setTransform(target);
    if (!isPinch) {
      setLabel(
        clientX,
        clientY,
        `S: ${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}`
      );
    }
  };

  const onWarp = ({ target, clientX, clientY, delta, multiply }) => {
    setFrame(frame.set(
      "transform",
      "matrix3d",
      multiply(frame.get("transform", "matrix3d"), delta)
    ));
    setTransform(target);
    setLabel(clientX, clientY, `X: ${clientX}px<br/>Y: ${clientY}px`);
  };

  const onRotate = ({ target, clientX, clientY, beforeDelta, isPinch }) => {
    const deg = parseFloat(frame.get("transform", "rotate")) + beforeDelta;

    setFrame(frame.set("transform", "rotate", `${deg}deg`));
    setTransform(target);
    if (!isPinch) {
      setLabel(clientX, clientY, `R: ${deg.toFixed(1)}`);
    }
  };

  // const onPinch = ({ clientX, clientY }) => {
  //   setTimeout(() => {
  //     setLabel(
  //       clientX,
  //       clientY,
  //       `X: ${frame.get("left")}
  // <br/>Y: ${frame.get("top")}
  // <br/>W: ${frame.get("width")}
  // <br/>H: ${frame.get("height")}
  // <br/>S: ${frame.get("transform", "scaleX").toFixed(2)}, ${frame
  //         .get("transform", "scaleY")
  //         .toFixed(2)}
  // <br/>R: ${parseFloat(frame.get("transform", "rotate")).toFixed(1)}deg
  // `
  //     );
  //   });
  // };

  const onEnd = () => {
    labelRef.current.style.display = "none";
  };

  return (
    <div className="page main">
      <Moveable
        ref={moveableObjectRef}
        target={state.target}
        pinchThreshold={20}
        container={document.body}
        draggable={true}
        scalable={state.scalable}
        resizable={state.resizable}
        warpable={state.warpable}
        rotatable={true}
        pinchable={true}
        origin={false}
        throttleDrag={1}
        throttleRotate={0.2}
        throttleResize={1}
        throttleScale={0.01}
        onDrag={onDrag}
        onResize={onResize}
        onScale={onScale}
        onWarp={onWarp}
        onRotate={onRotate}
        // onPinch={onPinch}
        onDragEnd={onEnd}
        onScaleEnd={onEnd}
        onResizeEnd={onEnd}
        onWarpEnd={onEnd}
        onRotateEnd={onEnd}
        onPinchEnd={onEnd}
      />
      <div className="container">
        <div className="moveable" ref={ref}>
          <span>
            Hello
            <br />
            Bi lui
          </span>
        </div>
        <div className="buttons able">
          <button
            className={state.scalable ? "selected" : ""}
            data-able="scalable"
            onClick={clickScalable}
          >
            Scalable
        </button>
          <button
            className={state.resizable ? "selected" : ""}
            data-able="resizable"
            onClick={clickResizable}
          >
            Resizable
        </button>
          <button
            className={state.warpable ? "selected" : ""}
            data-able="warpable"
            onClick={clickWarpable}
          >
            Warpable
        </button>
        </div>
      </div>
      <div className="label" ref={labelRef} />
    </div>
  );
};

export default DemoMoveable1;
