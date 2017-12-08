import $ from 'jquery';

export default class IComponent {
  constructor(root, state = {}) {
    this.root = root;
    this.state = state;
    this.$ = $;
    setTimeout(() => {
      this.init();
      this.render();
    }, 0);
  }

  init() {}
  setState(values) {
    this.state = {
      ...this.state,
      ...values,
    };
    this.render();
  }
  render() {}
}
