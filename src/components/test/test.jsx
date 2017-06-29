/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Duration, Icon } from 'components';
import { CodeSnippet, TestContext } from 'components/test';
import RaisedButton from 'material-ui/RaisedButton';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class Test extends React.Component {
  constructor() {
    super();
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
  }

  static propTypes = {
    test: PropTypes.object
  }

  state = {
    expanded: false
  }

  toggleExpandedState() {
    const { test } = this.props;
    if (test.pass || !!test.context || test.fail || test.isHook) {
      this.setState({ expanded: !this.state.expanded });
    }
  }

  render() {
    const { test } = this.props;
    const { uuid, title, trid, sessionId, sauceLabsAuth, sauceLabsVideoUrl, speed, duration, pass, fail, pending,
      skipped, isHook, err, context } = test;

    const testIcon = () => {
      let iconName;
      let iconClassName;
      if (pass) {
        iconName = 'check';
        iconClassName = 'pass';
      }
      if (fail) {
        iconName = 'close';
        iconClassName = 'fail';
      }
      if (pending) {
        iconName = 'pause';
        iconClassName = 'pending';
      }
      if (skipped) {
        iconName = 'stop';
        iconClassName = 'skipped';
      }
      if (isHook) {
        if (fail) {
          iconName = 'error_outline';
        } else {
          iconName = title.match(/^"before/) ? 'rotate_left' : 'rotate_right';
        }
        iconClassName = 'hook';
      }
      return <Icon name={ iconName } className={ cx('icon', iconClassName) } size={ isHook ? 24 : 18 } />;
    };

    const testRailId = () => {
      if (trid) {
        return <span className={ cx('trid') }>{ trid }</span>;
      } else {
        return null;
      }
    }

    const cxname = cx('component', {
      expanded: this.state.expanded,
      passed: pass,
      failed: fail,
      pending,
      skipped,
      hook: isHook,
      inactive: pending || skipped || (pass && !context),
      'with-context': !!context
    });

    const logURL = `./../logs/tests/${trid}.log`
    const screenshotURL = `./../screenshots/${sessionId}.png`
    const videoURL = `https://saucelabs.com/beta/tests/${sessionId}/watch?auth=${sauceLabsAuth}`
    const downloadVideoURL = `${sauceLabsVideoUrl}?auth=${sauceLabsAuth}`

    return (
      <section id={ uuid } className={ cxname }>
        <header className={ cx('header') } onClick={ this.toggleExpandedState }>
          <div className={ cx('title-wrap') }>
            { testIcon() }
            <h4 className={ cx('title') }>{ title }</h4>
          </div>
          <div className={ cx('info') }>
            { testRailId() }
            { !!context && <Icon name='chat_bubble_outline' className={ cx('context-icon') } size={ 18 } /> }
            { !isHook && <Duration className={ cx('duration') } timer={ duration } /> }
            { !isHook && <Icon name='timer' className={ cx('duration-icon', speed) } size={ 18 } /> }
          </div>
        </header>
        <div className={ cx('body') }>
          { <CodeSnippet className={ cx('code-snippet') } code={ err.estack } highlight={ false } label='Stack Trace' /> }
          { <CodeSnippet className={ cx('code-snippet') } code={ err.diff } lang='diff' label='Diff' /> }
          { !!context && <TestContext context={ context } /> }
        </div>
        <div className={ cx('controls-body') }>
          <RaisedButton label='Log' href={ logURL } target='_blank' style={ { 'margin-right': '10px' } } />
          <RaisedButton label='Screenshot' href={ screenshotURL } target='_blank' style={ { 'margin-right': '10px' } } />
          <RaisedButton label='Video' href={ videoURL } target='_blank' style={ { 'margin-right': '10px' } } />
          <RaisedButton label='Download' href={ downloadVideoURL } target='_blank' />
        </div>
      </section>
    );
  }
}

export default Test;
