const exampleInput = ``;

const testInput = ``;

const USE_EXAMPLE = false;

const input = USE_EXAMPLE ? exampleInput : testInput;

const LargeVertexName = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;
type LVN = typeof LargeVertexName[number];
type LargeVertexName = LVN | `${LVN}${LVN}`;
const SmallVertexName = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;
type SVN = typeof SmallVertexName[number];
type SmallVertexName = SVN | `${SVN}${SVN}`;

type VertexName = LargeVertexName | SmallVertexName | "start" | "end";

interface LargeVertex {
  type: "large_vertex";
  name: LargeVertexName;
}

interface SmallVertex {
  type: "small_vertex";
  name: SmallVertexName;
}

interface TerminalVertex {
  type: "terminal_vertex";
  name: "start" | "end";
}

type Vertex = LargeVertex | SmallVertex | TerminalVertex;

const Vertex = {
  parse(input: string): Vertex {
    switch (input) {
      case "start":
        return { type: "terminal_vertex", name: "start" };
      case "end":
        return { type: "terminal_vertex", name: "end" };
      default:
        if (input === input.toLowerCase()) {
          return {
            type: "small_vertex",
            name: input as SmallVertexName,
          };
        }
        return { type: "large_vertex", name: input as LargeVertexName };
    }
  },
};

interface Edge {
  from: Vertex;
  to: Vertex;
}

const Edge = {
  parse(input: string): Edge {
    const [from, to] = input.split("-");
    const fromVertex = Vertex.parse(from);
    const toVertex = Vertex.parse(to);
    return { from: fromVertex, to: toVertex };
  },
};

type Path = readonly Vertex[];

const Path = {
  serialize(path: Path): string {
    return path.map((v) => v.name).join(",");
  },
};

type Graph = Map<VertexName, Set<Vertex>>;

const Graph = {
  from(edges: Edge[]): Graph {
    const graph = new Map<VertexName, Set<Vertex>>();
    for (const edge of edges) {
      const from = edge.from;
      const to = edge.to;
      if (!graph.has(from.name)) {
        graph.set(from.name, new Set());
      }
      graph.get(from.name)!.add(to);
      if (!graph.has(to.name)) {
        graph.set(to.name, new Set());
      }
      graph.get(to.name)!.add(from);
    }
    return graph;
  },
  traverse(
    graph: Graph,
    _from?: Vertex,
    _visited: Set<SmallVertexName | "start" | "end"> = new Set(),
    _path: Path = []
  ): readonly Path[] {
    const from = _from || { type: "terminal_vertex", name: "start" };
    if (from.type === "terminal_vertex" && from.name === "end") {
      return [[..._path, from]];
    }
    const newVisited = new Set(_visited);
    if (from.type !== "large_vertex") {
      newVisited.add(from.name);
    }
    const children = Array.from(graph.get(from.name)!).filter(
      (child) => child.type === "large_vertex" || !newVisited.has(child.name)
    );
    return children.flatMap((child) => {
      return Graph.traverse(graph, child, newVisited, [..._path, from]);
    });
  },
};

if (require.main === module) {
  const edges = input.split("\n").map(Edge.parse);
  const graph = Graph.from(edges);
  const paths = Graph.traverse(graph).map(Path.serialize);
  console.log(paths.join("\n"), paths.length);
}

export {};
