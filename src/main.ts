import "./style/main.css";
import { Logic } from "./logic.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Memory</h1>
  <p id="timer">Таймер: 5:00</p>

  <div class="hero">

  </div>

  <div id="btns">
    <button id="gameStart4">Игра 4×4</button>
    <button id="gameStart6" disabled>Игра 6×6</button>
    <button id="gameStop" disabled>Играть снова</button>
  </div>

  <p id="moves">Ходов: 0</p>
  
  <p id="record">Рекорд: 0</p>
 
  <p id="end"></p>
`;

new Logic();
