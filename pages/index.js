import { useEffect, useState } from "react";
import Todo from "../components/Todo";
import {
	IconCheck,
	IconTrash,
	IconArrowUp,
	IconArrowDown,
	IconSunHigh,
	IconMoon,
} from "@tabler/icons";
import { ThemeContext } from "../contexts/ThemeContext";

export default function Home() {
	const theme = {
		light: {
			name: "light",
			background: "white",
			foreground: "black",
		},
		dark: {
			name: "dark",
			background: "black",
			foreground: "white",
		},
	};
	const [setTheme, setsetTheme] = useState(theme.dark);
	const toggleTheme = () => {
		if (setTheme.name === "light") setsetTheme(theme.dark);
		else setsetTheme(theme.light);
	};
	const setThemeLight = () => setsetTheme(theme.light);
	const setThemeDark = () => setsetTheme(theme.dark);

	const [todoText, setTodoText] = useState("");
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		const todoStr = localStorage.getItem(`react-todos`);
		if (todoStr == null) {
			setTodos([]);
		} else {
			setTodos(JSON.parse(todoStr));
		}
	}, []);

	const [isFirstRender, setIsFirstRender] = useState(true);

	useEffect(() => {
		if (isFirstRender) {
			setIsFirstRender(false);
			return;
		}
		saveTodo();
	}, [todos]);

	const onKeyUpHandler = (e) => {
		if (e.key != "Enter") return;
		if (e.target.value == "") {
			alert("Todo cannot be empty");
		} else {
			const newTodo = [...todos, { title: todoText, completed: false }];

			setTodos(newTodo);
			setTodoText("");
		}
	};
	const deleteTodo = (idx) => {
		todos.splice(idx, 1);
		const newTodos = [...todos];
		setTodos(newTodos);
	};

	const markTodo = (idx) => {
		const newTodos = [...todos];
		newTodos[idx].completed = !newTodos[idx].completed;
		setTodos(newTodos);
	};

	const moveUp = (idx) => {
		if (idx === 0) return;
		const title = todos[idx].title;
		const completed = todos[idx].completed;
		todos[idx].title = todos[idx - 1].title;
		todos[idx].completed = todos[idx - 1].completed;

		todos[idx - 1].title = title;
		todos[idx - 1].completed = completed;
		setTodos([...todos]);
	};

	const moveDown = (idx) => {
		if (idx === todos.length - 1) return;
		const title = todos[idx].title;
		const completed = todos[idx].completed;
		todos[idx].title = todos[idx + 1].title;
		todos[idx].completed = todos[idx + 1].completed;

		todos[idx + 1].title = title;
		todos[idx + 1].completed = completed;
		setTodos([...todos]);
	};

	const saveTodo = () => {
		const todoStr = JSON.stringify(todos);
		localStorage.setItem(`react-todos`, todoStr);
	};
	return (
		<div style={{ backgroundColor: setTheme.background, minHeight: "100vh" }}>
			<ThemeContext.Provider value={{ setTheme, toggleTheme }}>
				{/* Entire App container (required for centering) */}
				<div style={{ maxWidth: "700px" }} className="mx-auto">
					{/* App header */}
					<p
						className="display-4 text-center fst-italic m-4"
						style={{ color: setTheme.foreground }}
					>
						Minimal Todo List <span className="fst-normal">??????</span>
					</p>
					{/* Input */}
					<div className="d-flex aligh-items-center gap-2">
						<input
							className="form-control mb-1 fs-4"
							placeholder="insert todo here..."
							onChange={(e) => setTodoText(e.target.value)}
							value={todoText}
							onKeyUp={onKeyUpHandler}
						/>
						<button className="btn btn-dark" onClick={toggleTheme}>
							{setTheme.name === "light" && <IconSunHigh></IconSunHigh>}
							{setTheme.name === "dark" && <IconMoon></IconMoon>}
						</button>
					</div>

					{todos.map((todo, idx) => (
						<Todo
							key={idx}
							title={todo.title}
							completed={todo.completed}
							onDelete={() => deleteTodo(idx)}
							onMark={() => markTodo(idx)}
							onMoveUp={() => moveUp(idx)}
							onMoveDown={() => moveDown(idx)}
						/>
					))}

					{/* summary section */}
					<p className="text-center fs-4">
						<span className="text-primary">All ({todos.length}) </span>
						<span className="text-warning">
							Pending ({todos.filter((todo) => !todo.completed).length})
						</span>
						<span className="text-success">
							Completed ({todos.filter((todo) => todo.completed).length})
						</span>
					</p>

					{/* Made by section */}
					<p className="text-center mt-3 text-muted fst-italic">
						made by Nathaphong Phongsawaleesri 640610630
					</p>
				</div>
			</ThemeContext.Provider>
		</div>
	);
}
