import React, { Component } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

const data = {
  '/myProject': {
    path: '/myProject',
    type: 'folder',
    isRoot: true,
    isOpen: true,
    children: ['/myProject/src'],
  },
  '/myProject/src': {
    path: '/myProject/src',
    type: 'folder',
    children: ['/myProject/src/Main.java', '/myProject/src/Test.java', "/myProject/src/readme.md"]
  },
  '/myProject/src/readme.md': {
    path: '/myProject/src/readme.md',
    type: 'file',
  },

  '/myProject/src/Main.java': {
    path: '/myProject/src/Main.java',
    type: 'file',
  },
  '/myProject/src/Test.java': {
    path: '/myProject/src/Test.java',
    type: 'file',
  },
};

export default class Tree extends Component {

  state = {
    nodes: data,
  };

  getRootNodes = () => {
    const { nodes } = this.state;
    return values(nodes).filter(node => node.isRoot === true);
  }

  getChildNodes = (node) => {
    const { nodes } = this.state;
    if (!node.children) return [];
    return node.children.map(path => nodes[path]);
  }  

  onToggle = (node) => {
    const { nodes } = this.state;
    nodes[node.path].isOpen = !node.isOpen;
    this.setState({ nodes });
  }

  onNodeSelect = node => {
    const { onSelect } = this.props;
    onSelect(node);
  }

  render() {
    const rootNodes = this.getRootNodes();
    return (
      <div>
        { rootNodes.map(node => (
          <TreeNode 
            node={node}
            getChildNodes={this.getChildNodes}
            onToggle={this.onToggle}
            onNodeSelect={this.onNodeSelect}
          />
        ))}
      </div>
    )
  }
}

Tree.propTypes = {
  onSelect: PropTypes.func.isRequired,
};