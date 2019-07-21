class Graph {

  constructor() {
    this.edges = {};
    this.vertices = [];
  }

  vertexExists(vertex) {
    return this.vertices.includes(vertex);
  }

  addVertex(vertex) {
    if (this.vertexExists(vertex)) {
      //throw new Error('Такая вершина уже была добавлена ранее!');
    } else {
      this.vertices.push(vertex);
      this.edges[vertex] = [];
    }
  }

  removeVertex(vertex) {
    //удаляем ребра соседей
    this.edges[vertex].forEach(edge => {
      if (this.directedEdgeExists(vertex, edge.vertex)) {
        this.removeDirectedEdge(vertex, edge.vertex);
      }
      if (this.directedEdgeExists(edge.vertex, vertex)) {
        this.removeDirectedEdge(edge.vertex, vertex);
      }
    });
    //соседи тоже удаляют ребра с вершиной
    this.getNeighbours(vertex).forEach(item => {
      if (this.directedEdgeExists(item, vertex)) {
        this.removeDirectedEdge(item, vertex);
      }
    });
    //удаляем вершину из списка ребер
    delete this.edges[vertex];
    //удаляем саму вершину
    let index = this.vertices.indexOf(vertex);
    if (~index) {
      this.vertices.splice(index, 1);
    }
  };

  directedEdgeExists(vertex1, vertex2) {
    if (!this.vertexExists(vertex1) || !this.vertexExists(vertex2)) {
      throw new Error('Указаны несуществующие вершины!');
    } else {
      return this.edges[vertex1].findIndex(elem => elem.vertex == vertex2) != -1;
    }
  }

  addDirectedEdge(vertex1, vertex2, weight = 1) {
    if (this.directedEdgeExists(vertex1, vertex2)) {
      throw new Error('Такое ребро уже было добавлена ранее или указаны несуществующие вершины!');
    } else {
      this.edges[vertex1].push({
        vertex: vertex2,
        weight: weight
      });
    }
  }

  addEdge(vertex1, vertex2, weight = 1) {
    this.addDirectedEdge(vertex1, vertex2, weight);
    this.addDirectedEdge(vertex2, vertex1, weight);
  }

  removeDirectedEdge(vertex1, vertex2) {
    if (!this.directedEdgeExists(vertex1, vertex2)) {
      throw new Error('Такого ребра нет!');
    } else {
      let index = this.edges[vertex1].findIndex(elem => elem.vertex == vertex2);
      if (~index) {
        this.edges[vertex1].splice(index, 1);
      }
    }
  };

  removeEdge(vertex1, vertex2) {
    this.removeDirectedEdge(vertex1, vertex2);
    this.removeDirectedEdge(vertex2, vertex1);
  }

  getNeighbours(vertex) {
    let neighbours = [];
    this.edges[vertex].forEach(edge => neighbours.push(edge.vertex));
    return neighbours;
  }

  getWeight(vertex1, vertex2) {
    if (!this.directedEdgeExists(vertex1, vertex2)) {
      throw new Error('Такого ребра нет!');
    } else {
      let index = this.edges[vertex1].findIndex(elem => elem.vertex == vertex2);
      return this.edges[vertex1][index].weight;
    }
  }

  printMatrix() {
    let matrix = [],
      string = '';
    for (let i = 0; i < this.vertices.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < this.vertices.length; j++) {
        matrix[i][j] = this.directedEdgeExists(this.vertices[i], this.vertices[j]) ? 1 : 0;
        string += matrix[i][j] + ' ';
      }
      console.log(string);
      string = '';
    }
    return string;
  }

  getSubgraph() {
    let subgraph = new Graph();
    let args = arguments;
    for (let i = 0; i < args.length; i++) {
      subgraph.addVertex(args[i]);
      for (let j = 0; j < args.length; j++) {
        if (i != j && this.directedEdgeExists(args[i], args[j])) {
          subgraph.addVertex(args[j]);
          subgraph.addDirectedEdge(args[i], args[j])
        }
      }
    }
    return subgraph;
  }

  print() {
    console.log(this.vertices.map((vertex) => {
      let obj = this.edges[vertex].map(item => item.vertex + ' (' + item.weight + ')');
      return (vertex + '  -> ' + obj.join(',  ')).trim();
    }, this).join('\n'));
  };
}

// ## Необходимо реализовать класс или структуру классов, позволяющую создать граф с заданным числом вершим и ребер со следующими свойствами:
let graph = new Graph();
// 1.	Вершины могут быть представлены различными типами
// 7.	Должна быть возможность добавить новую вершину
graph.addVertex('🦑');
graph.addVertex('☘️');
graph.addVertex('☎️');
graph.addVertex('💧');
graph.addVertex('🍕');
graph.addVertex('🌑');
// 2.	Граф должен быть взвешенным
// 3.	Граф может быть как направленным, так и ненаправленным
// 8.	Должна быть возможность добавить новое ребро
graph.addEdge('🦑', '☘️', 9);
graph.addEdge('🦑', '💧', 1);
graph.addEdge('🦑', '☎️', 3);
graph.addEdge('🦑', '🍕', 5);
graph.addEdge('☘️', '💧', 7);
graph.addEdge('☘️', '☎️', 4);
graph.addEdge('☘️', '🍕', 2);
graph.addDirectedEdge('☎️', '💧', 6);
graph.addDirectedEdge('☎️', '🍕', 4);
graph.addDirectedEdge('💧', '🍕', 1);
graph.addDirectedEdge('🍕', '💧', 2);
graph.addDirectedEdge('🍕', '☎️', 4);
graph.addDirectedEdge('🌑', '🦑', 7);
// 6.	Должна быть возможность выбрать всех соседей указанной вершины
console.log('Соседи 🦑 :  ' + graph.getNeighbours('🦑'));
console.log('💧 и ☘️ связаны: ' + graph.directedEdgeExists('💧', '☘️'));
// 10.	Должна быть возможность удалить ребро
graph.removeEdge('💧', '🍕');
// 9.	Должна быть возможность удалить вершину
graph.removeVertex('🍕');
// 13.	Должна быть возможность получить вес указанного ребра
console.log('Длина ребра 🦑-☎️: ' + graph.getWeight('🦑', '☎️'));
console.log('Вывод графа: ');
graph.print();
// 12.	Должна быть возможность получить матрицы смежности
console.log('Матрица смежности: ');
graph.printMatrix();
// 14.	Должна быть возможность сделать выборку подграфа по указанным вершинам (на входе массив вершин, на выходе указанные вершины со всеми ребрами между ними)
console.log('Подграф 🌑+🦑+☘️: ');
console.log(graph.getSubgraph('☎️', '🌑', '☘️'));
console.log('Граф: ');
console.log(graph);