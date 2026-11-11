export class Logic {
  private playingFieldElement: HTMLElement | null;
  private gameStart4Element: HTMLButtonElement | null;
  private gameTimerElement: HTMLElement | null;
  private movesElement: HTMLElement | null;
  private endElement: HTMLElement | null;
  private recordElement: HTMLElement | null;

  private arrayField: DOMStringMap[] = [];
  private coincidences: number[] = [];
  private chosen: number[] = [];
  private moves = 0;

  private timer = 299;
  private timerId: number | null = null;
  private attempts = 2;

  constructor() {
    this.playingFieldElement = document.querySelector<HTMLElement>(".hero");
    this.gameStart4Element =
      document.querySelector<HTMLButtonElement>("#gameStart4");
    this.gameTimerElement = document.querySelector<HTMLElement>("#timer");
    this.movesElement = document.querySelector<HTMLElement>("#moves");
    this.endElement = document.querySelector<HTMLElement>("#end");
    this.recordElement = document.querySelector<HTMLElement>("#record");

    this.gameStart4Element?.addEventListener("click", () => this.startGame4());

    document.addEventListener("DOMContentLoaded", () => {
      if (!this.recordElement) return;

      this.recordElement.textContent = `Рекорд: ${
        localStorage.getItem("timer") ?? 0
      } сек, за ${localStorage.getItem("moves") ?? 0} ходов`;
    });
  }

  private fieldRandom(): string {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const numbers2 = [1, 2, 3, 4, 5, 6, 7, 8];
    let result = ``;

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    for (let i = numbers2.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers2[i], numbers2[j]] = [numbers2[j], numbers2[i]];
    }

    const combined = [...numbers, ...numbers2];

    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    for (let i = 0; i < 16; i++) {
      result += `<div class="field" data-id="${combined[i]}" data-choose="false" data-right="false">
            <img src="${import.meta.env.BASE_URL}icons/${combined[i]}.svg" alt="game">
        </div>`;
    }

    return result;
  }

  private startGame4() {
    const field = this.playingFieldElement;
    if (!field || !this.gameStart4Element) return null;

    field.style.pointerEvents = "auto";
    this.gameStart4Element.disabled = true;

    field.innerHTML = this.fieldRandom();
    this.timerStart();

    for (let i = 0; i < 16; i++) {
      const card = field.children[i] as HTMLElement;

      this.arrayField.push(card.dataset);
      card.addEventListener("click", () => this.checkingPairs(i));
    }
  }

  private checkingPairs(index: number) {
    const field = this.playingFieldElement;
    if (!field) return null;

    const el = field.children[index] as HTMLElement;

    // повторный клик по той же игнорируем
    if (el.dataset.choose === "true") return null;

    el.style.setProperty("--overlay-opacity", "0");
    el.dataset.choose = "true";

    this.coincidences.push(Number(el.dataset.id));
    this.chosen.push(index);
    this.attempts--;

    if (this.attempts === 0) {
      field.style.pointerEvents = "none";
      this.moves++;

      if (this.movesElement) {
        this.movesElement.textContent = `Ходов: ${this.moves}`;
      }

      const first = field.children[this.chosen[0]] as HTMLElement;
      const second = field.children[this.chosen[1]] as HTMLElement;

      if (this.coincidences[0] === this.coincidences[1]) {
        first.dataset.right = "true";
        second.dataset.right = "true";

        first.style.setProperty("pointer-events", "none");
        second.style.setProperty("pointer-events", "none");

        const rs = this.examination();
        if (rs) {
          this.endGame(true);
          return;
        }

        field.style.pointerEvents = "auto";
      } else {
        setTimeout(() => {
          first.style.setProperty("--overlay-opacity", "1");
          second.style.setProperty("--overlay-opacity", "1");

          field.style.pointerEvents = "auto";
        }, 700);
      }

      first.dataset.choose = "false";
      second.dataset.choose = "false";

      this.coincidences = [];
      this.chosen = [];
      this.attempts = 2;
    }
  }

  private examination() {
    if (!this.playingFieldElement) return null;
    const el = this.playingFieldElement.children;

    for (let i = 0; i < el.length; i++) {
      if ((el[i] as HTMLElement).dataset.right === "false") {
        return false;
      }
    }

    return true;
  }

  private timerStart() {
    this.timerId = window.setInterval(() => {
      if (!this.gameTimerElement) return;

      const min = Math.floor(this.timer / 60);
      const sec = String(this.timer % 60).padStart(2, "0");

      this.gameTimerElement.textContent = `Таймер: ${min}:${sec}`;

      if (this.timer === 0) {
        this.endGame(false);
        return;
      }

      this.timer--;
    }, 1000);
  }

  private endGame(state: boolean) {
    const field = this.playingFieldElement;
    if (!field) return null;

    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    field.style.pointerEvents = "none";

    if (!this.endElement) return null;

    if (state) {
      this.endElement.textContent = `Вы выграли за ${300 - this.timer} секунд и ${this.moves} ходов`;
      localStorage.setItem("moves", String(this.moves));
      localStorage.setItem("timer", String(300 - this.timer));
    } else {
      this.endElement.textContent = `Вы проиграли`;
    }
  }
}
