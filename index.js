import "./css/style.min.css";

const DEFAULT_OPTIONS = {
  position: "top-right",
  autoClose: 6000,
  canClose: true,
  showProgress: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
};

export class Toast {
  #toastElement;
  #removeBinded;
  #autoClose;
  #autoCloseFrame;
  #timeVisible;
  #progressFrame;
  #visibilityChange;
  #unpause;
  #pause;
  #isPaused;
  #shouldUnPause;

  constructor(options) {
    //*** Create element ***/
    this.#toastElement = document.createElement("div");
    this.#toastElement.classList.add("toast");
    //*** Control animation show  ***/
    requestAnimationFrame(() => {
      this.#toastElement.classList.add("show");
    });
    this.#removeBinded = this.remove.bind(this);
    this.#unpause = () => (this.#isPaused = false);
    this.#pause = () => (this.#isPaused = true);
    this.#visibilityChange = () => {
      this.#shouldUnPause = document.visibilityState === "visible";
    };
    //*** Setup options ***/
    this.update({ ...DEFAULT_OPTIONS, ...options });
  }

  /**
   * @param {"top-left" | "top-center" | "top-right" | "top-full" | "bottom-left" | "bottom-center" | "bottom-right" | "bottom-full"} value
   */
  set position(value) {
    const currentToast = this.#toastElement.parentElement;
    const container =
      document.querySelector(`.toast-container[data-position=${value}]`) ||
      createContainer(value);
    container.append(this.#toastElement);
    if (currentToast == null || currentToast.hasChildNodes()) return;
    currentToast.remove();
  }

  /**
   * @param {string | null} value
   */
  set icon(value) {
    if (value) this.#toastElement.style.setProperty("--icon", `"${value}"`);
  }

  /**
   * @param {string | null} value
   */
  set title(value) {
    if (value) {
      const title =
        this.#toastElement.querySelector(".toast__title") ||
        document.createElement("h3");
      title.classList.add("toast__title");
      title.textContent = value;
      this.#toastElement.prepend(title);
    }
  }

  /**
   * @param {string | null} value
   */
  set message(value) {
    if (value) {
      const message =
        this.#toastElement.querySelector(".toast__message") ||
        document.createElement("p");
      message.classList.add("toast__message");
      message.textContent = value;
      this.#toastElement.append(message);
    }
  }

  /**
   * @param {"success" | "info" | "warning" | "danger" | "load" | string | null} value
   */
  set color(value) {
    if (/^#(?:[0-9a-fA-F]{3,4}){1,2}$/.test(value)) {
      this.#toastElement.style.setProperty("--color", value.toString());
    } else {
      const cls = [
        "toast--success",
        "toast--info",
        "toast--warning",
        "toast--danger",
        "toast--load",
      ];
      this.#toastElement.classList.remove(...cls);
      this.#toastElement.classList.add("toast--" + value);
    }
  }

  /**
   * @param {number} value
   */
  set autoClose(value) {
    this.#autoClose = value;
    this.#timeVisible = 0;
    if (value === 0) return;

    let lastTime;
    const advance = (time) => {
      if (this.#shouldUnPause) {
        lastTime = null;
        this.#shouldUnPause = false;
      }
      if (lastTime == null) {
        lastTime = time;
        this.#autoCloseFrame = requestAnimationFrame(advance);
        return;
      }
      if (!this.#isPaused) {
        this.#timeVisible += time - lastTime;
        if (this.#timeVisible >= this.#autoClose) {
          this.remove();
          return;
        }
      }
      lastTime = time;
      this.#autoCloseFrame = requestAnimationFrame(advance);
    };
    this.#autoCloseFrame = requestAnimationFrame(advance);
  }

  /**
   * @param {boolean | undefined} value
   */
  set canClose(value) {
    this.#toastElement.classList.toggle("toast--close", value);
    if (value) {
      this.#toastElement.addEventListener("click", this.#removeBinded);
    } else {
      this.#toastElement.removeEventListener("click", this.#removeBinded);
    }
  }

  /**
   * @param {boolean | undefined} value
   */
  set showProgress(value) {
    this.#toastElement.classList.toggle("toast--progress", this.#autoClose);
    this.#toastElement.style.setProperty("--progress", "1");
    if (value) {
      const advance = () => {
        if (!this.#isPaused) {
          this.#toastElement.style.setProperty(
            "--progress",
            (1 - this.#timeVisible / this.#autoClose).toString()
          );
        }
        this.#progressFrame = requestAnimationFrame(advance);
      };
      this.#progressFrame = requestAnimationFrame(advance);
    }
  }

  /**
   * @param {boolean | undefined} value
   */
  set pauseOnHover(value) {
    if (value) {
      this.#toastElement.addEventListener("mouseover", this.#pause);
      this.#toastElement.addEventListener("mouseleave", this.#unpause);
    } else {
      this.#toastElement.removeEventListener("mouseover", this.#pause);
      this.#toastElement.removeEventListener("mouseleave", this.#unpause);
    }
  }

  /**
   * @param {boolean | undefined} value
   */
  set pauseOnFocusLoss(value) {
    if (value) {
      document.addEventListener("visibilitychange", this.#visibilityChange);
    } else {
      document.removeEventListener("visibilitychange", this.#visibilityChange);
    }
  }

  update(options) {
    Object.entries(options).forEach(([key, value]) => (this[key] = value));
  }

  remove() {
    cancelAnimationFrame(this.#autoCloseFrame);
    cancelAnimationFrame(this.#progressFrame);
    const toast = this.#toastElement.parentElement;
    this.#toastElement.classList.remove("show");
    this.#toastElement.addEventListener("transitionend", () => {
      this.#toastElement.remove();
      if (toast == null || toast.hasChildNodes()) return;
      toast.remove();
    });
    if (typeof this.onClose !== "function") return;
    this.onClose();
  }
}

function createContainer(position) {
  const container = document.createElement("aside");
  container.classList.add("toast-container");
  container.dataset.position = position;
  document.body.append(container);
  return container;
}

export function clearToast() {
  const container = document.querySelectorAll(".toast-container");
  container?.forEach((el) => {
    const toasts = el.querySelectorAll(".toast");
    toasts?.forEach((toast) => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => {
        toast.remove();
        if (el == null || el.hasChildNodes()) return;
        el.remove();
      });
    });
  });
}
