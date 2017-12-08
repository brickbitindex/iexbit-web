import testModel from './test';
import IComponent from '../components/BaseComponent';

class Store {
  constructor() {
    this.db = {};
    this.reducers = {};
    this.triggers = {
      '*': [],
    };
    this.setState = this.setState.bind(this);
  }
  register(model) {
    const name = model.name;
    if (name in this.db) return;
    this.db[name] = model.state || {};
    const reducers = model.reducers || {};
    Object.keys(reducers).forEach((key) => {
      this.reducers[name + '/' + key] = reducers[key];
    });
    this.triggers[name] = [];
  }
  setState(modelName, valueObj) {
    if (typeof valueObj === 'object') {
      this.db[modelName] = {
        ...this.db[modelName],
        ...valueObj,
      };
    } else {
      this.db[modelName] = valueObj;
    }
    this.triggers[modelName].forEach((trigger) => {
      trigger(this.db);
    });
    this.triggers['*'].forEach((trigger) => {
      trigger(this.db);
    });
  }
  onChange(modelName, callback) {
    if (!this.triggers[modelName]) {
      console.warn(`Unknown type '${modelName}' in Trigger.`);
      this.triggers[modelName] = [callback];
      return;
    }
    this.triggers[modelName].push(callback);
  }
}

function async(makeGenerator) {
  return (...args) => {
    const generator = makeGenerator.apply(this, args);

    if (generator && generator.next) {
      const handle = (result) => { // { done: [Boolean], value: [Object] }
        if (result.done) return result.value;

        return result.value.then(
          res => handle(generator.next(res)),
          err => handle(generator.throw(err))
        );
      };

      return handle(generator.next());
    }
    return generator;
  };
}

const store = new Store();
store.register(testModel);

function dispatch(opts) {
  const _opts = {
    payload: {},
    onSuccess() {},
    onFail() {},
    ...opts,
  };
  if (!_opts.type) {
    throw new Error('type is required in Dispatch.');
  }
  if (!store.reducers[_opts.type]) {
    console.warn(`Unknown type '${_opts.type}' in Dispatch.`);
    return;
  }
  async(store.reducers[_opts.type])(_opts, {
    dispatch,
    getState: cb => cb(store.db),
    setState: store.setState,
  });
}

export function connect(triggers, map) {
  let _triggers = triggers;
  if (typeof triggers === 'string') _triggers = [triggers];

  return function wrapComponent(C) {
    if (triggers === '*') {
      console.warn(`You are using * trigger at ${C.name}.`);
    }
    return class WrappedComponent extends IComponent {
      constructor(root) {
        super(root);
        this.C = new C(root, map(store.db));
        this.C.dispatch = dispatch;
      }

      init() {
        _triggers.forEach((pick) => {
          store.onChange(pick, (db) => {
            this.setState(map(db));
          });
        });
      }

      setState(v) {
        this.C.setState(v);
      }
    };
  };
}

export default connect;
