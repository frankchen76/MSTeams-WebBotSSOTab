import logo from './logo.svg';
import './App.css';
import MicrosoftGraphProfileMenu from './ui/MicrosoftGraphProfileMenu';
import OAuthComposer from './oauth/Composer';
import WebChat from './ui/WebChat';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const App = () => (
    <div>
        <OAuthComposer>
            <MicrosoftGraphProfileMenu />
            <WebChat />
        </OAuthComposer>
    </div>
);


export default App;
