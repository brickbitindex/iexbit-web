function some() {
  return new Promise((r) => {
    setTimeout(() => {
      r(2);
    }, 1000);
  });
}

const model = {
  name: 'Test',
  state: {
    in: 'aaa',
    data: 1,
  },
  reducers: {
    handle1({ payload }, { setState }) {
      setState('Test', payload);
    },

    handle2(_, { getState, dispatch }) {
      const ina = getState(({ Test }) => Test.in);
      dispatch({
        type: 'Test/handle1',
        payload: {
          out: ina,
        },
      });
    },

    async handle3(_, { setState }) {
      const data = await some();
      setState('Test', {
        data,
      });
    },
  },
};

export default model;
