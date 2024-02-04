export function buildTree(flatArr: any[], pid: string) {
  const tree = [];

  flatArr.forEach((node) => {
    if (node.pid === pid) {
      const children = buildTree(flatArr, node.id);
      if (children.length > 0) {
        node.children = children;
      }
      tree.push(node);
    }
  });

  return tree;
}

// 遍历 flatArr, 将其内部可以组装为树形结构的数据组装起来，不可以的原样输出
export function buildTreePlus(flatArr) {
  const idToNodeMap = new Map();

  // 将数组转换为以 id 为 key 的映射
  for (const item of flatArr) {
    idToNodeMap.set(item.id, { ...item });
  }

  const tree = [];

  // 遍历映射，将每个节点放到其父节点的 children 数组中
  for (const node of idToNodeMap.values()) {
    const pid = node.pid;
    if (pid === 0) {
      // 根节点
      tree.push(node);
    } else {
      // 子节点
      const parent = idToNodeMap.get(pid);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        // 如果找不到父节点，则将当前节点直接放到树中
        tree.push(node);
      }
    }
  }

  return tree;
}
