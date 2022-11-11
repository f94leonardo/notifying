# @f94leo/notifying

This package, written in vanilla JavaScript and CSS, allows you to easily add notifications in your web project.

## Installation

```
$ npm i @lf/notify
```

## Features

- Super easy to customize with variables css
- Customize colors, icons and positions
- Pause toast when is hover and/or when the window loses focus
- Possibility to update a toast
- Can remove all toast
- Fancy progress bar to display the remaining time
- onClose hooks.

## Default variables css

<details>
<summary>Show variables css</summary>
<br>

```css
:root {
  /*! Color palette */
  --success: hsl(152, 66%, 36%);
  --info: hsl(216, 96%, 56%);
  --warning: hsl(45, 96%, 56%);
  --danger: hsl(354, 76%, 56%);
  --load: hsl(45, 96%, 56%);
  --white: hsl(0, 0%, 96%);
  --black: hsl(0, 0%, 16%);
  /*! width of site content for full size toast */
  --site-content: 88vw;
  /*! Style toast continer */
  --toast-width: 24rem;
  --toast-padding: 1rem;
  --toast-gap: 1rem;
  /*! Style toast message */
  --message-font-size: 1rem;
  --message-title-font-size: 1.25rem;
  --message-padding: 1.25rem 1.5rem;
  --message-border-radius: 0.75rem;
  --message-border-width: 1.6px;
  --message-transition: all 365ms ease-in-out;
  --progress-bar-height: 3px;
  /*! Icons */
  --icon-font-family: symbol;
  --icon-font-weight: 400;
  --icon-font-size: 1.5rem;
  --icon-xmark: "\2715";
  --icon-success: "\2713";
  --icon-info: "\2139";
  --icon-warning: "\26A0";
  --icon-danger: "\2717";
  --icon-load: "\27F3";
}
```

</details>
<br>
If the package doesn't work, especially with react, copy these variables into your stylesheet 😉

## Options

<details>
<summary>Show options</summary>
<br>

| Options Name     | Values                                                                                                         | Description                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| position         | top-left<br>top-center<br>top-right<br>top-full<br>bottom-left<br>bottom-center<br>bottom-right<br>bottom-full | Position of container toast **default: top-left**                 |
| title            | string                                                                                                         | Title h3 of toast                                                 |
| message          | Sting                                                                                                          | Text of toast                                                     |
| icon             | Sting                                                                                                          | CSS icon code or emoji                                            |
| color            | success<br>info<br>warning<br>danger<br>load<br>color hexadecimal                                              | Color of icon and border toast                                    |
| autoClose        | Number Time in milliseconds Toast is visible                                                                   | If it is equal to 0 the toast is always visible **default: 6000** |
| canClose         | Boolean                                                                                                        | Toggle to enable close toast **default: true**                    |
| showProgress     | Boolean                                                                                                        | Toggle to show progress **default: true**bar                      |
| pauseOnHover     | Boolean                                                                                                        | Toggle to enable pause on hover **default: true**                 |
| pauseOnFocusLoss | Boolean                                                                                                        | Toggle to enable pause on window loses focus **default: true**    |
| onClose          | Function                                                                                                       | Function that is left when the toast is closed                    |

</details>

## Functions

| Functions Name | Description             |
| :------------- | :---------------------- |
| update         | Update options of toast |
| clearToast     | Clear all toast         |

## Demo

```js
import { Toast, clearToast } from "@lf/notify";

const notify = new Toast({
  title: "Title",
  message: "Lorem ipsum dolor sit amet consectetur.",
  color: "load",
});

notify.update({
  title: "New title",
  message: "Change the options here",
  color: "success",
});

clearToast();
```
