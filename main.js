Array.prototype.pick = function() {
  const i = Math.floor(Math.random() * this.length);
  return this[i];
};

let expectedState = {};
let actualState = {};

const d3Category10 = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
]
  

function populatePanels(expectedPanel, actualPanel, n) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const populatePanel = panel => {
    while (panel.childNodes.length > 0) {
      panel.removeChild(panel.childNodes[panel.childNodes.length - 1]);
    }
    for (let i = 0; i < n; ++i) {
      const element = document.createElement('div');
      element.innerText = 'Steven';//alphabet[i];
      element.classList += 'tile';
      element.style = `background-color: ${d3Category10[i]}`;
      panel.appendChild(element);
    }
  }

  populatePanel(expectedPanel);
  populatePanel(actualPanel);
}

function initialize() {
  const randomizeButton = document.getElementById('randomize-button');
  const expectedPanel = document.getElementById('expected');
  const actualPanel = document.getElementById('actual');
  const panelsRoot = document.getElementById('panels-root');
  const flexDirectionInput = document.getElementById('flex-direction-input');
  const justifyContentInput = document.getElementById('justify-content-input');
  const alignItemsInput = document.getElementById('align-items-input');
  const flexWrapInput = document.getElementById('flex-wrap-input');
  const alignContentInput = document.getElementById('align-content-input');
  const statusLabel = document.getElementById('status');

  const score = document.getElementById('score')
  const time = document.getElementById('time')
  let startTime = new Date()
  const coin = document.getElementById('coin')
  const stageClear = document.getElementById('stage-clear')
  const pauseSound = document.getElementById('pause-sound')

  const includeReverseCheckbox = document.getElementById('include-reverse-checkbox');
  const includeWrapCheckbox = document.getElementById('include-wrap-checkbox');

  const flexWrapLabel = document.getElementById('flex-wrap-label');
  const alignContentLabel = document.getElementById('align-content-label');

  const flexDirectionWithoutReverseOptions = ['row', 'column'];
  const flexDirectionWithReverseOptions = ['row', 'column', 'row-reverse', 'column-reverse'];
  const justifyContentOptions = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
  const alignItemsOptions = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline', ];
  const flexWrapOptions = ['nowrap', 'wrap', 'wrap-reverse'];
  const alignContentOptions = ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'];

  let flexDirectionOptions = flexDirectionWithoutReverseOptions;

  actualPanel.style['flex-direction'] = 'row';
  actualPanel.style['align-items'] = 'stretch';
  actualPanel.style['justify-content'] = 'flex-start';
  actualPanel.style['flex-wrap'] = 'nowrap';
  actualPanel.style['align-content'] = 'stretch';

  includeReverseCheckbox.addEventListener('change', () => {
    if (includeReverseCheckbox.checked) {
      flexDirectionOptions.splice(0, flexDirectionOptions.length, ...flexDirectionWithReverseOptions);
    } else {
      flexDirectionOptions.splice(0, flexDirectionOptions.length, ...flexDirectionWithoutReverseOptions);
    }
  });

  const reload = (mode, n) => {
    flexWrapInput.style.display = mode;
    alignContentInput.style.display = mode;
    flexWrapLabel.style.display = mode;
    alignContentLabel.style.display = mode;
    populatePanels(expectedPanel, actualPanel, n);
  }

  includeWrapCheckbox.addEventListener('change', () => {
    if (includeWrapCheckbox.checked) {
      reload('inline', 26);
    } else {
      actualPanel.style['flex-wrap'] = 'nowrap';
      reload('none', 4);
    }
  });

  reload('none', 4);

  const randomize = () => {
    // startTime = new Date()
    expectedState = {
      'justify-content': justifyContentOptions.pick(),
      'align-items': alignItemsOptions.pick(),
      'flex-direction': flexDirectionOptions.pick(),
    };
    if (expectedState['flex-direction'] === 'column' && expectedState['align-items'] === 'baseline') {
      expectedState['align-items'] = alignItemsOptions.slice(1) //omit baseline for column
    }

    if (includeWrapCheckbox.checked) {
      expectedState['flex-wrap'] = flexWrapOptions.pick();
      if (expectedState['flex-wrap'] === 'nowrap') {
        expectedState['justify-content'] = 'flex-start';
        expectedState['align-content'] = 'stretch';
      } else {
        expectedState['align-content'] = alignContentOptions.pick();
      }
    } else {
      expectedState['flex-wrap'] = 'nowrap';
      expectedState['align-content'] = 'stretch';
    }

    expectedPanel.style['flex-direction'] = expectedState['flex-direction'];
    expectedPanel.style['justify-content'] = (expectedState['justify-content'] === 'center' ? 'safe ' : '') + expectedState['justify-content'];
    expectedPanel.style['align-items'] = (expectedState['align-items'] === 'center' ? 'safe ' : '') + expectedState['align-items'];
    expectedPanel.style['flex-wrap'] = expectedState['flex-wrap'];
    expectedPanel.style['align-content'] = expectedState['align-content'];

    panelsRoot.style['flex-direction'] = expectedState['flex-direction'].startsWith('row') ? 'column' : 'row';
    statusLabel.innerHTML = isRight() ? '&#128077;&#127997;' : '&#128078;&#127997;';
  };

  randomizeButton.addEventListener('click', randomize);

  const initialStyle = getComputedStyle(actualPanel);
  actualState = {
    'flex-direction': initialStyle['flex-direction'],
    'justify-content': initialStyle['justify-content'],
    'align-items': initialStyle['align-items'],
    'flex-wrap': initialStyle['flex-wrap'],
    'align-content': initialStyle['align-content'],
  };
  flexDirectionInput.value = actualState['flex-direction'];
  justifyContentInput.value = actualState['justify-content'];
  alignItemsInput.value = actualState['align-items'];
  flexWrapInput.value = actualState['flex-wrap'];
  alignContentInput.value = actualState['align-content'];

  const registerListener = (input, property, options) => {
    input.addEventListener('input', () => {
      actualState[property] = input.value;
      if (options.includes(actualState[property])) {
        let prefix = '';
        if ((property === 'align-items' || property === 'justify-content') && actualState[property] === 'center') {
          prefix = 'safe ';
        }
        actualPanel.style[property] = prefix + actualState[property];
      }
      statusLabel.innerHTML = isRight() ? '&#128077;&#127997;' : '&#128078;&#127997;';
      
      console.log(expectedState[input.id.substr(0, input.id.length - '-input'.length)], input.value);
      if (expectedState[input.id.substr(0, input.id.length - '-input'.length)] === input.value) {
        coin.play();
      }
    });
  };

  registerListener(flexDirectionInput, 'flex-direction', flexDirectionOptions);
  registerListener(justifyContentInput, 'justify-content', justifyContentOptions);
  registerListener(alignItemsInput, 'align-items', alignItemsOptions);
  registerListener(flexWrapInput, 'flex-wrap', flexWrapOptions);
  registerListener(alignContentInput, 'align-content', alignContentOptions);

  document.querySelectorAll('input[type="text"]').forEach((elem) => {
    elem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && isRight()) {
        splits.push(time.innerHTML)
        score.innerText = splits.length
        stageClear.play();
        randomize();
        flexDirectionInput.select();
      }
    });
    elem.addEventListener('blur', (e) => {
      console.log('blur', e)
      console.log(expectedState[e.target.id.substr(0, e.target.id.length - '-input'.length)], e.target.value);
      if (expectedState[e.target.id.substr(0, e.target.id.length - '-input'.length)] === e.target.value) {
        coin.play();
      }
    });
  });

  randomize();
  flexDirectionInput.select();
  
  const splits = []
  let timerRunning = true;
  let elapsedPaused = 0
  
  setInterval(() => {
    const delta = new Date() - startTime - elapsedPaused;
    const deltaDisplay = new Date(delta).toLocaleString('en-US', {
      minute: '2-digit', 
      second: '2-digit', 
    })
    if (timerRunning) {
      time.innerText = `${deltaDisplay}`
    }
  }, 1000);

  let pauseBegan = 0;

  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      pauseSound.play();
      document.body.classList.toggle('paused')
      if (document.body.classList.contains('paused')) {
        timerRunning = false;
        // clearInterval(timer);
        pauseBegan = new Date();
        pauseSound.play();
      } else {
        timerRunning = true;
        elapsedPaused += (new Date() - pauseBegan)
        pauseBegan = 0;
      }
    }
  });
}

function isRight() {
  // console.log("expectedState:", expectedState);
  // console.log("actualState:", actualState);
  const expectedPositions = Array.from(document.querySelectorAll('#expected div'));
  const actualPositions = Array.from(document.querySelectorAll('#actual div'));
  return expectedPositions
    .map((elem, i) => elem.offsetLeft === actualPositions[i].offsetLeft && elem.offsetTop === actualPositions[i].offsetTop)
    .reduce((acc, cur) => acc && cur)
  // console.log(actual, Array.from(actualPositions).map((elem) => [elem.offsetLeft, elem.offsetTop]))
  // return expectedState['flex-direction'] === actualState['flex-direction'] &&
  //        expectedState['justify-content'] === actualState['justify-content'] &&
  //        expectedState['align-items'] === actualState['align-items'] &&
  //        expectedState['flex-wrap'] === actualState['flex-wrap'] &&
  //        expectedState['align-content'] === actualState['align-content'];
}

window.addEventListener('load', initialize);
