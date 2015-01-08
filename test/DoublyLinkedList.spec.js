describe('Doubly linked list', function(){
  describe('List Node', function(){
    it('List node should exist', function(){
      expect(Node).toBeDefined();
    });
  });
  describe('List', function(){
    it('List should exist', function(){
      expect(List).toBeDefined();
    });
    it('List fake head and tail must be defined', function(){
      var list = new List();

      expect(list.head).toBeDefined();
      expect(list.tail).toBeDefined();
    });
    it('Initially List head next must point to tail', function(){
      var list = new List();

      expect(list.head.next).toEqual(list.tail);
    });
    it('Initially List tail prev must point to head', function(){
      var list = new List();

      expect(list.tail.prev).toEqual(list.head);
    });

    describe('List method "first"', function(){
      it('Must return first item in the list if the list is not empty', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          element3 = 'newElement3';

        list.push(element1);
        list.push(element2);
        list.push(element3);

        expect(list.first()).toEqual(element1);
      });
      it('Must return undefined if the list is empty', function(){
        var list = new List();

        expect(list.first()).toBeUndefined();
      });
    });

    describe('List method "last"', function(){
      it('Must return last item in the list if the list is not empty', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          element3 = 'newElement3';

        list.push(element1);
        list.push(element2);
        list.push(element3);

        expect(list.last()).toEqual(element3);
      });
      it('Must return undefined if the list is empty', function(){
        var list = new List();

        expect(list.last()).toBeUndefined();
      });
    });

    describe('List getElementByIndex method', function(){
      it('Must return item in the list if the list is not empty', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          element3 = 'newElement3';

        list.push(element1);
        list.push(element2);
        list.push(element3);

        expect(list.getElementByIndex(0)).toEqual(element1);
        expect(list.getElementByIndex(1)).toEqual(element2);
        expect(list.getElementByIndex(2)).toEqual(element3);
      });
      it('Must return undefined if the list is empty', function(){
        var list = new List();

        expect(list.getElementByIndex(0)).toBeUndefined();
      });
      it('_reindexNumberIndexes method must be called once if there were no changes since last getElementByIndex', function(){
        var list = new List(),
            element1 = 'newElement1',
            element2 = 'newElement2',
            element3 = 'newElement3';

        spyOn(list, '_reindexNumberIndexes').and.callThrough();


        list.push(element1);
        list.push(element2);
        list.push(element3);

        list.getElementByIndex(0);
        list.getElementByIndex(1);
        list.getElementByIndex(2);

        expect(list._reindexNumberIndexes.calls.count()).toEqual(1);
      });
      it('_reindexNumberIndexes method must be called on getElementByIndex if there were changes since last getElementByIndex', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          element3 = 'newElement3';

        spyOn(list, '_reindexNumberIndexes').and.callThrough();


        list.push(element1);
        list.getElementByIndex(0);

        list.push(element2);
        list.getElementByIndex(1);

        list.push(element3);
        list.getElementByIndex(2);

        expect(list._reindexNumberIndexes.calls.count()).toEqual(3);
      });
      it('getElementByIndex must return correct element after reindexing', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          element3 = 'newElement3',
          resultElement1, resultElement2, resultElement3;

        spyOn(list, '_reindexNumberIndexes').and.callThrough();


        list.push(element1);
        resultElement1 = list.getElementByIndex(0);

        list.push(element2);
        resultElement2 = list.getElementByIndex(1);

        list.push(element3);
        resultElement3 = list.getElementByIndex(2);

        expect(resultElement1).toBe(element1);
        expect(resultElement2).toBe(element2);
        expect(resultElement3).toBe(element3);
      });
    });

    describe('List push/pop', function(){
      it('Push method must add one element to the end of the list', function(){
        var list = new List(),
          element = 'newElement',
          newNode;

        list.push(element);

        newNode = list.tail.prev;
        expect(newNode.getElement()).toEqual(element);

        expect(list.tail.next).toBeNull();
        expect(list.tail.prev).not.toEqual(list.head);
        expect(list.head.prev).toBeNull();
        expect(list.head.next).not.toEqual(list.tail);

        expect(list.head.next).toEqual(newNode);
        expect(list.tail.prev).toEqual(newNode);

        expect(newNode.next).toEqual(list.tail);
        expect(newNode.prev).toEqual(list.head);

      });
      it('Push method must add two elements to the end of the list', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          newNode1, newNode2;

        list.push(element1);

        newNode1 = list.tail.prev;

        list.push(element2);

        newNode2 = list.tail.prev;

        expect(newNode1.getElement()).toEqual(element1);
        expect(newNode2.getElement()).toEqual(element2);

        expect(list.tail.next).toBeNull();
        expect(list.tail.prev).toEqual(newNode2);
        expect(list.head.prev).toBeNull();
        expect(list.head.next).toEqual(newNode1);

        expect(newNode1.next).toEqual(newNode2);
        expect(newNode1.prev).toEqual(list.head);

        expect(newNode2.prev).toEqual(newNode1);
        expect(newNode2.next).toEqual(list.tail);

      });
      it('Push method must throw en error if element is already in the list', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement1';

        list.push(element1);

        expect(function(){
          list.push(element2);
        }).toThrowError('This element is already in the list: ' + element2);

      });
      it('List size must be increased on push', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2';

        list.push(element1);
        list.push(element2);

        expect(list.size()).toBe(2);

      });
      it('Pop on empty list must return undefined and don\'t break the list', function(){
        var list = new List(),
          popped, head, tail;

        popped = list.pop();
        head = list.head;
        tail = list.tail;

        expect(popped).toBeUndefined();
        expect(head).toBeDefined();
        expect(tail).toBeDefined();
        expect(head.next).toEqual(tail);
        expect(head.prev).toBeNull();
        expect(tail.next).toBeNull();
        expect(tail.prev).toEqual(head);

      });
      it('Pop method must remove the last Node from the list', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          newNode1, newNode2;

        list.push(element1);

        newNode1 = list.tail.prev;

        list.push(element2);

        newNode2 = list.tail.prev;

        list.pop();

        expect(list.tail.next).toBeNull();
        expect(list.tail.prev).toEqual(newNode1);
        expect(list.head.prev).toBeNull();
        expect(list.head.next).toEqual(newNode1);

        expect(newNode1.next).toEqual(list.tail);
        expect(newNode1.prev).toEqual(list.head);

        expect(newNode2.next).toBeNull();
        expect(newNode2.prev).toBeNull();

        newNode2 = null;
      });
      it('List size must be decreased on pop', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2';

        list.push(element1);
        list.push(element2);
        list.pop(element2);

        expect(list.size()).toBe(1);

      });
    });

    describe('List unshift/shift', function(){
      it('Unshift method must add one element to the beginning of the list', function(){
        var list = new List(),
          element = 'newElement',
          newNode;

        list.unshift(element);

        newNode = list.head.next;


        expect(newNode.getElement()).toEqual(element);

        expect(list.tail.next).toBeNull();
        expect(list.tail.prev).toEqual(newNode);
        expect(list.head.prev).toBeNull();
        expect(list.head.next).toEqual(newNode);

        expect(newNode.next).toEqual(list.tail);
        expect(newNode.prev).toEqual(list.head);

      });
      it('Unshift method must add two elements to the beginning of the list', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          newNode1, newNode2;

        list.unshift(element1);

        newNode1 = list.head.next;

        list.unshift(element2);

        newNode2 = list.head.next;

        expect(newNode1.getElement()).toEqual(element1);
        expect(newNode2.getElement()).toEqual(element2);

        expect(list.tail.next).toBeNull();
        expect(list.tail.prev).toEqual(newNode1);
        expect(list.head.prev).toBeNull();
        expect(list.head.next).toEqual(newNode2);

        expect(newNode1.next).toEqual(list.tail);
        expect(newNode1.prev).toEqual(newNode2);

        expect(newNode2.prev).toEqual(list.head);
        expect(newNode2.next).toEqual(newNode1);

      });
      it('Unshift method must throw en error if element is already in the list', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement1';

        list.unshift(element1);

        expect(function(){
          list.unshift(element2);
        }).toThrowError('This element is already in the list: ' + element2);

      });
      it('List size must be increased on unshift', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2';

        list.unshift(element1);
        list.unshift(element2);

        expect(list.size()).toBe(2);

      });
      it('Shift on empty list must return undefined and don\'t break the list', function(){
        var list = new List(),
          popped, head, tail;

        popped = list.shift();
        head = list.head;
        tail = list.tail;

        expect(popped).toBeUndefined();
        expect(head).toBeDefined();
        expect(tail).toBeDefined();
        expect(head.next).toEqual(tail);
        expect(head.prev).toBeNull();
        expect(tail.next).toBeNull();
        expect(tail.prev).toEqual(head);

      });
      it('Shift method must remove element from the beginning of the list', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2',
          newNode1, newNode2;

        list.unshift(element1);

        newNode1 = list.head.next;

        list.unshift(element2);

        newNode2 = list.head.next;

        list.shift();

        expect(list.tail.next).toBeNull();
        expect(list.tail.prev).toEqual(newNode1);
        expect(list.head.prev).toBeNull();
        expect(list.head.next).toEqual(newNode1);

        expect(newNode1.next).toEqual(list.tail);
        expect(newNode1.prev).toEqual(list.head);

        expect(newNode2.next).toBeNull();
        expect(newNode2.prev).toBeNull();

        newNode2 = null;

      });
      it('List size must be decreased on shift', function(){
        var list = new List(),
          element1 = 'newElement1',
          element2 = 'newElement2';

        list.unshift(element1);
        list.unshift(element2);
        list.shift(element2);

        expect(list.size()).toBe(1);

      });
    });

    describe('Iterate the list', function(){
      beforeEach(function(){
        this.list = new List();
        this.element1 = 'newElement1';
        this.element2 = 'newElement2';

        this.list.push(this.element1);
        this.list.push(this.element2);
      });
      it('Should iterate over List from left to right using for...of loop', function(){
        var list = this.list,
            counter = 0;

        for(var element of list.traverse()){
          counter++;
        }

        expect(counter).toBe(2);
      });
      it('Should iterate over List from right to left using for...of loop', function(){
        var list = this.list,
          counter = 0;

        for(var element of list.traverseRight()){
          counter++;
        }

        expect(counter).toBe(2);
      });
      it('Should iterate over List from left to right and give correct results', function(){
        var list = this.list,
          resultsArr = [],
          expectedArr = [this.element1, this.element2];

        for(var element of list.traverse()){
          resultsArr.push(element);
        }

        expect(resultsArr).toEqual(expectedArr);
      });
      it('Should iterate over List from right to left and give correct results', function(){
        var list = this.list,
          resultsArr = [],
          expectedArr = [this.element2, this.element1];

        for(var element of list.traverseRight()){
          resultsArr.push(element);
        }

        expect(resultsArr).toEqual(expectedArr);
      });

      it('Should iterate the list from given element to the right if given element is present in the list', function(){
        var list = this.list,
          element3 = 'element3',
          element4 = 'element4',
          resultArr = [],
          expectedArr = [element3, this.element2, this.element1];

        list.push(element3);
        list.push(element4);

        for(var element of list.traverseFromRight(element4)){
          resultArr.push(element);
        }

        expect(resultArr).toEqual(expectedArr);
      });

      it('Should iterate the list from given element to the left if given element is present in the list', function(){
        var list = this.list,
          element3 = 'element3',
          element4 = 'element4',
          resultArr = [],
          expectedArr = [element3, element4];

        list.push(element3);
        list.push(element4);

        for(var element of list.traverseFrom(this.element2)){
          resultArr.push(element);
        }

        expect(resultArr).toEqual(expectedArr);
      });

      it('Iterate from should throw en error if specified element is not in the list', function(){
        var list = this.list,
          element3 = 'element3',
          element4 = 'element4',
          notInTheListElement = 'notInTheList';

        list.push(element3);
        list.push(element4);


        expect(function(){
          for(var element of list.traverseFrom(notInTheListElement)){
            resultArr.push(element);
          }
        }).toThrowError('No such element in the list: ' + notInTheListElement);
      });

    });

    describe('List remove', function(){
      beforeEach(function(){
        this.list = new List();
        this.element1 = 'newElement1';
        this.element2 = 'newElement2';

        this.list.push(this.element1);
        this.list.push(this.element2);
      });

      describe('By element', function(){
        it('Should remove element from list that exists in the list', function(){
          var list = this.list;

          list.remove(this.element1);

          expect(list.head.next.getElement()).toBe(this.element2);
          expect(list.size()).toBe(1);
          expect(list.elementIndexesMap.size).toBe(1);
        });

        it('Should return removed element', function(){
          var list = this.list,
            removedElement;

          removedElement = list.remove(this.element1);

          expect(removedElement).toBe(this.element1);
        });

        it('Should throw an error if element is not present in the list', function(){
          var list = this.list,
            elementThatIsNotInTheList = 'elementThatIsNotInTheList';

          expect(function(){
            list.remove(elementThatIsNotInTheList);
          }).toThrowError('Failed to remove element that does not exist in the List: ' + elementThatIsNotInTheList);
          expect(list.size()).toBe(2);
          expect(list.elementIndexesMap.size).toBe(2);
        });
      });

      describe('By index', function(){
        it('Should remove element from list that exists in the list', function(){
          var list = this.list;

          list.removeByIndex(0);

          expect(list.head.next.getElement()).toBe(this.element2);
          expect(list.size()).toBe(1);
          expect(list.numberIndexesMap.size).toBe(1);
        });

        it('Should remove two elements from list that exists in the list', function(){
          var list = this.list;

          list.removeByIndex(0);
          list.removeByIndex(0);

          expect(list.head.next).toEqual(list.tail);
          expect(list.size()).toBe(0);
          expect(list.numberIndexesMap.size).toBe(0);
        });

        it('Should throw an error if element with gives index is not in the list', function(){
          var list = this.list;


          expect(function(){
            list.removeByIndex(5);
          }).toThrowError('Failed to remove element that does not exist in the List by index: ' + 5);
          expect(list.size()).toBe(2);
        });
      });

    });

    describe('Has element', function(){
      beforeEach(function(){
        this.list = new List();
        this.element1 = 'newElement1';
        this.element2 = 'newElement2';

        this.list.push(this.element1);
        this.list.push(this.element2);
      });

      it('Has must return true if the given element is present in the list', function(){
        var list = this.list,
            isPresent;

        isPresent = list.has(this.element2);

        expect(isPresent).toBeTruthy();

      });

      it('Has must return false if the given element is not present in the list', function(){
        var list = this.list,
          isPresent;

        isPresent = list.has('notPresentElement');

        expect(isPresent).toBeFalsy();

      });
    });

    describe('List insertBefore', function(){
      beforeEach(function(){
        this.list = new List();
        this.element1 = 'newElement1';
        this.element2 = 'newElement2';

        this.list.push(this.element1);
        this.list.push(this.element2);
      });

      it('Should insert given element before specified element that exists in the list', function(){
        var list = this.list,
            elementToInsert = 'elementToInsert',
            insertBeforeElement = this.element1;

        list.insertBefore(insertBeforeElement, elementToInsert);

        expect(list.head.prev).toBeNull();
        expect(list.head.next.getElement()).toBe(elementToInsert);
        expect(list.head.next.next.getElement()).toBe(this.element1);
        expect(list.head.next.next.next.getElement()).toBe(this.element2);
        expect(list.elementIndexesMap.size).toBe(3);
      });

      it('Should increase size of the list after insertion', function(){
        var list = this.list,
          elementToInsert = 'elementToInsert',
          insertBeforeElement = this.element1;

        list.insertBefore(insertBeforeElement, elementToInsert);

        expect(list.size()).toBe(3);
      });

      it('Should throw en error if element to insert before is not present in the list', function(){
        var list = this.list,
          elementToInsert = 'elementToInsert';

        expect(function(){
          list.insertBefore('elementThatIsNotPresent', elementToInsert);
        }).toThrowError('Element to insert before is not present in the list: ' + 'elementThatIsNotPresent');
      });

      describe('List insertAfter', function(){
        beforeEach(function(){
          this.list = new List();
          this.element1 = 'newElement1';
          this.element2 = 'newElement2';

          this.list.push(this.element1);
          this.list.push(this.element2);
        });

        it('Should insert given element before specified element that exists in the list', function(){
          var list = this.list,
            elementToInsert = 'elementToInsert',
            insertAfterElement = this.element1;

          list.insertAfter(insertAfterElement, elementToInsert);

          expect(list.head.prev).toBeNull();
          expect(list.head.next.getElement()).toBe(this.element1);
          expect(list.head.next.next.getElement()).toBe(elementToInsert);
          expect(list.head.next.next.next.getElement()).toBe(this.element2);
          expect(list.elementIndexesMap.size).toBe(3);
        });

        it('Should increase size of the list after insertion', function(){
          var list = this.list,
            elementToInsert = 'elementToInsert',
            insertAfterElement = this.element1;

          list.insertAfter(insertAfterElement, elementToInsert);

          expect(list.size()).toBe(3);
        });

        it('Should throw en error if element to insert before is not present in the list', function(){
          var list = this.list,
            elementToInsert = 'elementToInsert';

          expect(function(){
            list.insertAfter('elementThatIsNotPresent', elementToInsert);
          }).toThrowError('Element to insert after is not present in the list: ' + 'elementThatIsNotPresent');
        });
      });

    });
  });

});