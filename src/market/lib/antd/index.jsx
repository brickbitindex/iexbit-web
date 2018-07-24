import React from 'react';
import { connect } from 'dva';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Slider from 'antd/lib/slider';
import Tooltip from 'antd/lib/tooltip';
import originMessage from 'antd/lib/message';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import Tabs from 'antd/lib/tabs';
import OriginTable from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import Badge from 'antd/lib/badge';
import Popconfirm from 'antd/lib/popconfirm';

import MobileTable from './mobileTable';

const message = {};

['success', 'error', 'info', 'warning', 'warn', 'loading'].forEach((k) => {
  message[k] = (msg, ...args) => {
    const messages = window._appStore.getState().i18n.messages;
    let _message = msg;
    if (msg in messages) {
      _message = messages[msg];
    }
    originMessage[k](_message, ...args);
  };
});

function mapStateToPropsTable({ mobile }) {
  return {
    isMobile: mobile.isMobile,
  };
}

const Table = connect(mapStateToPropsTable)((props) => {
  const { isMobile, useMobileTable } = props;
  let size = props.size;
  if (!size) {
    size = isMobile ? 'middle' : 'default';
  }
  if (useMobileTable && isMobile) {
    return <MobileTable {...props} />;
  }
  return (
    <OriginTable
      {...props}
      size={size}
    />
  );
});


export {
  Button,
  Select,
  Slider,
  Tooltip,
  message,
  Form,
  Input,
  Dropdown,
  Menu,
  Tabs,
  Table,
  Icon,
  Pagination,
  Modal,
  Badge,
  Popconfirm,
};
