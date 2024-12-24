/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
'use client';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import React, { useEffect, useMemo, useState } from "react";
// import { loadAll } from @/tsparticles/all; // if you are going to use `loadAll`, install the @tsparticles/all package too.
// import { loadFull } from tsparticles; // if you are going to use `loadFull`, install the tsparticles package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the @tsparticles/slim package too.
// import { loadBasic } from @tsparticles/basic; // if you are going to use `loadBasic`, install the @tsparticles/basic package too.



const ParticlesComponent = (props) => {

  const [init, setInit] = useState(false);
  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };


  const options = useMemo(() => ({
    background: {
      color: "#000000",
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: 300  ,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#3FBFBD", // Changed dot color to #DD7CB2
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
      },
      opacity: {
        value: 1,
        anim: { enable: false },
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: false },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#DD7CB2", // Changed line color to #3FBFBD
        opacity: 0.4,
        width: 2,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outModes: { default: "out" },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 400, links: { opacity: 1 } },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 1,
        },
        repulse: { distance: 200, duration: 0.4 },
        push: { quantity: 4 },
        remove: { quantity: 2 },
      },
    },
    detectRetina: true,
  }), []);
  
  


  return <Particles id={props.id} init={particlesLoaded} options={options} />; 
};

export default React.memo(ParticlesComponent);