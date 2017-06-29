import { observable, computed, action } from 'mobx';
import filter from 'lodash/filter';
import map from 'lodash/map';
import compact from 'lodash/compact';

class ReportStore {
  @observable sideNavOpen = false;
  @observable showPassed = true;
  @observable showFailed = true;
  @observable showPending = true;
  @observable showSkipped = true;
  @observable quickSummaryWidth = null;
  @observable windowWidth = null;
  @observable showHooks = 'failed'; // [failed|always|never]

  constructor(data = {}) {
    this.data = data;
  }

  @computed get suites() {
    const derived = compact(map(this.allSuites, this._mapSuites));
    return derived;
  }

  @computed get mobileBreakpoint() {
    return this.windowWidth < 768;
  }

  @action openSideNav() {
    this.sideNavOpen = true;
  }

  @action closeSideNav() {
    this.sideNavOpen = false;
  }

  @action toggleFilter(prop) {
    this[prop] = !this[prop];
  }

  @action setShowHooks(prop) {
    const validProps = [ 'failed', 'always', 'never' ];
    if (validProps.indexOf(prop) >= 0) {
      this.showHooks = prop;
    }
  }

  @action setQuickSummaryWidth(width) {
    this.quickSummaryWidth = width;
  }

  @action setWindowWidth(width) {
    this.windowWidth = width;
  }

  _filterHook = hook => (
      (this.showHooks === 'always')
      || (this.showHooks === 'failed' && hook.fail)
  )

  _mapSuites = suite => {
    const suites = compact(map(suite.suites, this._mapSuites));
    const tests = filter(suite.tests, test => (
      (this.showPassed && test.pass)
      || (this.showFailed && test.fail)
      || (this.showPending && test.pending)
      || (this.showSkipped && test.skipped)
    ));

    const beforeHooks = filter(suite.beforeHooks, this._filterHook);
    const afterHooks = filter(suite.afterHooks, this._filterHook);

    return (beforeHooks.length || afterHooks.length || tests.length || suites.length)
      ? Object.assign({}, suite, { suites, beforeHooks, afterHooks, tests })
      : null;
  }

  setInitialData({ data, config }) {
    const reportTitle = config.reportTitle || data.reportTitle;
    Object.assign(this, { data, ...config, reportTitle });
    this.allSuites = [ data.suites ];
    this.stats = data.stats;
    this.enableChart = config.enableCharts;
    this.devMode = config.dev;
  }
}

const reportStore = new ReportStore();
window.reportStore = reportStore;
export default reportStore;

export { ReportStore };
