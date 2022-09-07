import WorldMap from './WorldMap'
import React from 'react'
import styled from 'styled-components';
import { Reset }  from 'styled-reset'
import { createGlobalStyle } from 'styled-components'

// import ReactHover, { Trigger, Hover } from 'react-hover'
// import TriggerComponent from './components/TriggerComponent'
// import HoverComponent from './components/HoverComponent'

const GlobalStyleComponent = createGlobalStyle`
  *{
    box-sizing: border-box;
    /* display: flex;
    justify-content: center;
    flex-direction: column; */
    /* border:1px solid black */
    /* outline:1px solid black; */
    /* margin: 20px; */
    /* background-color: red; */
  }
`

function App() {
  return (
    <>
      <Reset/>
      <GlobalStyleComponent />
      <WorldMap />
    </>
  );
}

export default App;
