# NeoFusion Stopwatch Application

![Stopwatch Screenshot](screenshot.png)

A modern stopwatch application with dual display modes - digital and analog. Toggle between sleek digital display with neon effects and a classic analog clock display.

## Features

- **Dual Display Modes**: 
  - Modern digital display with neon effects
  - Classic analog clock with moving hands
- **Precise Timing**: Measures hours, minutes, seconds, and milliseconds
- **Lap Functionality**: Record and display lap times
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Sleek design with neon effects and smooth animations

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6)

## How to Use

1. Open `index.html` in your web browser
2. Choose your preferred display mode:
   - **Digital**: Modern digital display with neon effects
   - **Analog**: Classic clock face with moving hands
3. Use the control buttons:
   - **Start**: Begin timing
   - **Pause**: Pause the stopwatch
   - **Reset**: Reset to zero and clear laps
   - **Lap**: Record current lap time
4. View lap times in the lap section

## File Structure

```
Stopwatch-app/
├── index.html
├── styles/
│   └── Stopwatch.css
└── scripts/
    └── Stopwatch.js
```

## Installation

No installation required. Simply open `index.html` in any modern web browser.

## Customization

You can customize the appearance by modifying the CSS variables in `Stopwatch.css`:

```css
:root {
  --neon-blue: #0ff;       /* Neon blue color */
  --neon-pink: #f0f;       /* Neon pink color */
  --neon-purple: #90f;     /* Neon purple color */
  --dark-bg: #0e0e1f;      /* Dark background */
  --darker-bg: #0a0a16;    /* Darker background */
  --card-bg: rgba(30,30,50,0.7); /* Card background */
  --text-light: #fff;      /* Light text color */
  --text-gray: #aaa;       /* Gray text color */
}
```

## License

This project is licensed under the MIT License.