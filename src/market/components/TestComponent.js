import IComponent from './BaseComponent';
import connect from '../store';

class TestComponent extends IComponent {
  init() {
    const $ = this.$;
    const $t = $('<div></div>');
    this.$t = $t;
    $(this.root).append($t);
    this.dispatch({
      type: 'Test/handle3',
    });
  }

  render() {
    const { value } = this.state;
    this.$t.html(value);
    return true;
  }
}

function map(db) {
  const { Test } = db;
  return {
    value: Test.data,
  };
}

// export default connect('*', map)(TestComponent);
export default connect('Test', map)(TestComponent);
