/**
 * Doubly linked list implementation.
 * Indexed list.
 * Only unique values are supported in this list.
 * This implementation allows:
 *  - Get first element.
 *  - Get last element.
 *  - Push/pop elements.
 *  - Shift/Unshift elements.
 *  - Insert element after/before particular element.*1 See important note below.
 *  - Has element.*1 See important note below.
 *  - Remove element.
 *  - Get element by index.
 *  - Remove element by index.*2 See important note below.
 *  - Get list length.
 *  - Support iteration from specific element.
 *
 *  Iterators:
 *  ES6 version:
 *  - Iterate over elements using ES6 generators. For...of loop might be used.
 *  ES5 version:
 *  - Iterates over elements using inner iterator(callback);
 *
 *  TODO:
 *  - Sorting of the list for primitive types only.
 *  - AMD/Common.js support.
 *
 *  Important notes:
 *  1. Comparison of the elements in the list is made by reference for Reference types.
 *     There is no deep equality check for Reference types.
 *  2. Removing elements by index very costly operation. TODO: Think about performance improvements.
 *     Removing element cause list to reindex itself. Elements are "shifted" to the left.
 * */

/**
 * Node constructor. Each node in the list is created using this class.
 *
 * @param element - element to insert in list. Each Node holds one element.
 * @constructor
 */
//"use strict";
function Node(element){
  this.element = element;
  this.next = null;
  this.prev = null;
}
Node.prototype = {
  constructor: Node,
  /**
   * Set reference to the next node in the list.
   *
   * @param nextNode{Node|Null} - List Node.
   */
  setNext: function(nextNode){
    this.next = nextNode;
  },
  /**
   * Get next node of this node.
   *
   * @returns {null|Node} - Node in the list.
   */
  getNext: function(){
    return this.next;
  },
  /**
   * Set reference to the previous node in the list.
   *
   * @param prevNode{Node|Null} - List Node.
   */
  setPrev: function(prevNode){
    this.prev = prevNode;
  },
  /**
   * Get previous Node of this node.
   *
   * @returns {null|Node} - List Node.
   */
  getPrev: function(){
    return this.prev;
  },
  /**
   * Get element that is held by Node.
   *
   * @returns {*} - Real element from Node.
   */
  getElement: function(){
    return this.element;
  }
};

/**
 * List constructor.
 * Fake head and fake tail are used in this implementation.
 * Initially fake head points to the fake tail.
 *
 * @constructor
 */
function List(){
  // Fake head.
  this.head = new Node('head');
  // Fake tail.
  this.tail = new Node('tail');

  this.head.setNext(this.tail);
  this.tail.setPrev(this.head);

  // Initial size of the list.
  this.length = 0;

  this.elementIndexesMap = new Map();
  this.numberIndexesMap = new Map();
  this.numberIndexesMustBeReindexed = false;
}
List.prototype = {
  constructor: List,
  /**
   * Simply return first element in the list.
   *
   * @returns {Any} - Node value.
   */
  first: function(){
    if(this.size() === 0) return;

    return this.head.getNext().getElement();
  },
  /**
   * Simply return last element in the list.
   *
   * @returns {Any} - Node value.
   */
  last: function(){
    if(this.size() === 0) return;

    return this.tail.getPrev().getElement();
  },
  /**
   * Get element from list by index keeping added order.
   * In case of deleting intermediate Node - the same behavior as [].splice(start, 1);
   *
   * @param index
   * @returns {Any} - Node value or undefined.
   */
  getElementByIndex: function(index){
    var listNode;
    if(this.numberIndexesMustBeReindexed){
      this._reindexNumberIndexes();
      this.numberIndexesMustBeReindexed = false;
    }
    return ( (listNode = this.numberIndexesMap.get(index) ) && listNode.getElement());
  },
  /**
   * Push element to the end of the list.
   *
   * @param element {Any} - Node value.
   */
  push: function(element){
    if(this.has(element)){
      throw new Error('This element is already in the list: ' + element);
    }
    this._addNodeToLeft(this.tail, new Node(element));
    this._increaseSize();
  },
  /**
   * Pop node from the end of the list.
   *
   * @returns {Any} - return real element.
   */
  pop: function(){
    var nodeValue;
    if(this.size() === 0) return;

    nodeValue = this._removeNode(this.tail.getPrev());
    this._decreaseSize();

    return nodeValue;
  },
  /**
   * Add element to the beginning of the List.
   *
   * @param element {Any} - Node value.
   */
  unshift: function(element){
    if(this.has(element)){
      throw new Error('This element is already in the list: ' + element);
    }
    this._addNodeToLeft(this.head.getNext(), new Node(element));
    this._increaseSize();
  },
  /**
   * Remove element from the beginning of the list.
   *
   * @returns {Any} - Node value.
   */
  shift: function(){
    var nodeValue;
    if(this.size() === 0) return;

    nodeValue = this._removeNode(this.head.getNext());
    this._decreaseSize();

    return nodeValue
  },
  /**
   * Insert element to the position before specified element.
   *
   * @param insertBeforeElement {Any} - element to insert before.
   * @param elementToInsert {Any} - element to insert.
   */
  insertBefore: function(insertBeforeElement, elementToInsert){
    var beforeElement;
    if(!this.has(insertBeforeElement)){
      throw new Error('Element to insert before is not present in the list: ' + insertBeforeElement);
    }

    if(this.has(elementToInsert)){
      throw new Error('This element is already in the list: ' + elementToInsert);
    }

    beforeElement = this._getElementFromElementIndexes(insertBeforeElement);

    this._addNodeToLeft(beforeElement, new Node(elementToInsert));
    this._increaseSize();
  },
  /**
   * Insert element to the position after specified element.
   *
   * @param insertAfterElement {Any} - element to insert after.
   * @param elementToInsert {Any} - element to insert.
   */
  insertAfter: function(insertAfterElement, elementToInsert){
    var afterElement;
    if(!this.has(insertAfterElement)){
      throw new Error('Element to insert after is not present in the list: ' + insertAfterElement);
    }

    if(this.has(elementToInsert)){
      throw new Error('This element is already in the list: ' + elementToInsert);
    }

    afterElement = this._getElementFromElementIndexes(insertAfterElement);
    this._addNodeToLeft(afterElement.getNext(), new Node(elementToInsert));
    this._increaseSize();
  },
  /**
   * Check if element exists in the list.
   *
   * @param element {Any} - element in the list.
   * @returns {Boolean} - does element exist in the list.
   */
  has: function(element){
    return this.elementIndexesMap.has(element);
  },
  /**
   * Get size of the list.
   *
   * @returns {number} - List size.
   */
  size: function(){
    return this.length;
  },
  /**
   * Remove element from the list.
   *
   * @param element {Any} - element to remove.
   * @returns {Any} - node value.
   */
  remove: function(element){
    var listNode, nodeValue;

    if(!this.elementIndexesMap.has(element)){
      throw new Error('Failed to remove element that does not exist in the List: ' + element);
    }

    listNode = this.elementIndexesMap.get(element);

    nodeValue = this._removeNode(listNode);
    this._decreaseSize();
    return nodeValue;
  },
  /**
   * Remove element from the list by index.
   *
   * @param index {Number} - index of element.
   * @returns {*} - Node value.
   */
  removeByIndex: function(index){
    var nodeValue;

    if(this.numberIndexesMustBeReindexed){
      this._reindexNumberIndexes();
      this.numberIndexesMustBeReindexed = false;
    }

    if(!this.numberIndexesMap.has(index)){
      throw new Error('Failed to remove element that does not exist in the List by index: ' + index);
    }

    nodeValue = this.remove(this.numberIndexesMap.get(index).getElement());

    this._reindexNumberIndexes();

    return nodeValue;
  },
  /**
   * Traverse List left to right.
   * Generator is used here.
   */
  traverse: function* (){
    for(var listNode of this._iterate('left')){
      yield listNode.getElement();
    }
  },
  /**
   * Traverse List right to left.
   * Generator is used here.
   */
  traverseRight: function* (){
    for(var listNode of this._iterate('right')){
      yield listNode.getElement();
    }
  },
  /**
   * Traverse list from given element in order.
   *
   * @param element {Any} - element to traverse from
   */
  traverseFrom: function* (element){
    if(!this.has(element)){
      throw new Error('No such element in the list: ' + element);
    }

    for(var listNode of this._iterate('left', this._getElementFromElementIndexes(element))){
      yield listNode.getElement();
    }
  },
  /**
   * Traverse list from given element in right order.
   *
   * @param element {Any} - element to traverse from.
   */
  traverseFromRight: function* (element){
    if(!this.has(element)){
      throw new Error('No such element in the list: ' + element);
    }

    for(var listNode of this._iterate('right', this._getElementFromElementIndexes(element))){
      yield listNode.getElement();
    }
  },
  /**
   * Increase size of the list by one.
   *
   * @private
   */
  _increaseSize: function(){
    this.length++;
  },
  /**
   * Decrease size of the list by one.
   *
   * @private
   */
  _decreaseSize: function(){
    if(this.length === 0){
      throw new Error('List size can not be less then 0');
    }
    this.length--;
  },
  /**
   * Using this method we can insert new nodes in the List.
   * We always insert new node before Node that is passed to the first argument.
   *
   * @param insertBeforeNode {Node} - Node that new element will be inserted before
   * @param currentNode {Node} - Node to insert before.
   * @private
   */
  _addNodeToLeft: function(insertBeforeNode, currentNode){
    // Get Node that will be on the left hand side relative to currentNode.
    var prevNode = insertBeforeNode.getPrev();

    // Set current Node as next relative to prevNode.
    prevNode.setNext(currentNode);

    /*
     Set references to current Node.
     insertBeforeNode will be on the right hand side.
     prevNode will be on the left hand side.
     */
    currentNode.setPrev(prevNode);
    currentNode.setNext(insertBeforeNode);

    // current Node will on the left hand side relative to insertBeforeNode.
    insertBeforeNode.setPrev(currentNode);

    this._addToElementIndexes(currentNode);
    this.numberIndexesMustBeReindexed = true;
  },
  /**
   * Simply change references of the prev and next Nodes
   * relative to current node.
   *
   * @param currentNode {Node} - Node to remove from list
   * @returns {Any} - Node value.
   * @private
   */
  _removeNode: function(currentNode){
    var prevNode, nextNode;

    prevNode = currentNode.getPrev();
    nextNode = currentNode.getNext();

    prevNode.setNext(nextNode);
    nextNode.setPrev(prevNode);

    /*
     Remove references from current node to avoid leaks.
     I think it's not necessary to do it because we don't have references to this Node.
     But i do it.
     */
    currentNode.setNext(null);
    currentNode.setPrev(null);

    this._removeFromElementIndexes(currentNode);
    this.numberIndexesMustBeReindexed = true;

    return currentNode.getElement();
  },
  /**
   * Add Node to indexes structure.
   * Using Node value as key in Map.
   * Note itself will be used as value.
   *
   * @param listNode {Node} - list Node.
   * @private
   */
  _addToElementIndexes: function(listNode){
    this.elementIndexesMap.set(listNode.getElement(), listNode);
  },
  /**
   * Remove Node from indexes structure.
   *
   * @param listNode {Node} - list Node
   * @private
   */
  _removeFromElementIndexes: function(listNode){
    this.elementIndexesMap.delete(listNode.getElement(), listNode);
  },
  /**
   * Get Node from the indexes structure using node value as key.
   *
   * @param element {Any} - element that is held by the Node.
   * @returns {Node} - Node in teh list.
   * @private
   */
  _getElementFromElementIndexes: function(element){
    return this.elementIndexesMap.get(element);
  },
  /**
   * Reindex number indexes of the List.
   * We must perform this operation when the list is changed somehow.
   * List tries to perform this operation in lazy way.
   * For example we can add to the list and if are not working with indexes - this method will not be called.
   * But when we are trying to get element by index - this method will be called ones. If there are some changes between
   * getting element by index - indexation will be done again.
   *
   * @private
   */
  _reindexNumberIndexes: function(){
    var index = 0;

    this.numberIndexesMap.clear();
    for(var listNode of this._iterate('left')){
      this.numberIndexesMap.set(index++, listNode);
    }
  },
  /**
   * Iterate over list using generator.
   *
   * @param direction {String} - direction to iterate. Left or Right.
   * @param startNode {Node} - Start Node to iterate from. By default might be head or tail. it depends on direction.
   */
  _iterate: function* (direction, startNode){
    // TODO: Define a better place to place this directions hash.
    var getMethod,startElement, endElement, node,
      directions, _this;

    if(startNode && !(startNode instanceof Node)){
      throw new Error('startNode to iterate from must be Node type.');
    }

    _this = this;
    directions = {
      'right': function(){
        getMethod = 'getPrev';
        startElement = startNode || _this.tail;
        endElement = _this.head;
      },
      'left': function(){
        getMethod = 'getNext';
        startElement = startNode || _this.head;
        endElement = _this.tail;
      }
    };
    if(!(direction in directions)){
      throw new Error('Unsupported operation. There are no directions with name: ' + direction);
    }

    directions[direction]();

    node = startElement[getMethod]();

    while( node !== endElement ){
      yield node;
      node = node[getMethod]();
    }
  }
};