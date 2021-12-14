import React from 'react'
import ReactDOMServer  from 'react-dom/server'
import ReactDOM from 'react-dom'
import CharacterSheet from './src/sheet'



// static-site-generator-webpack-plugin needs an exported function that returns markup
export default () => { 
    return ReactDOMServer.renderToStaticMarkup(<CharacterSheet/>)
};


if ( typeof document !== 'undefined' ) {
    ReactDOM.render(<CharacterSheet/>, document.getElementById('root'));
}