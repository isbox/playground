import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AudioDemo from './pages/audio-api';
import AudioDemo01 from './pages/audio-api/index01';
import AudioDemo02 from './pages/audio-api/index02';
import AudioDemo03 from './pages/audio-api/index03';
import AudioDemo04 from './pages/audio-api/index04';
import AudioDemo05 from './pages/audio-api/index05';
import AudioDemo06 from './pages/audio-api/index06';
import AudioDemo07 from './pages/audio-api/index07';
import ThreeDemo from './pages/three';

import WebglDemo01 from './pages/webgl/demo01';

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/audio-api" exact component={AudioDemo} />
        <Route path="/audio-api/index01" exact component={AudioDemo01} />
        <Route path="/audio-api/index02" exact component={AudioDemo02} />
        <Route path="/audio-api/index03" exact component={AudioDemo03} />
        <Route path="/audio-api/index04" exact component={AudioDemo04} />
        <Route path="/audio-api/index05" exact component={AudioDemo05} />
        <Route path="/audio-api/index06" exact component={AudioDemo06} />
        <Route path="/audio-api/index07" exact component={AudioDemo07} />
        <Route path="/three" exact component={ThreeDemo} />
        <Route path="/webgl/demo01" exact component={WebglDemo01} />
      </Switch>
    </Router>
  );
};
