"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./globals.css"
import "./app.css"
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import SwapText from "@/components/animata/text/swap-text";


Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
    const { user, signOut } = useAuthenticator();
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id });
    }

    function listTodos() {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }

    useEffect(() => {
        listTodos();
    }, []);

    function createTodo() {
        client.models.Todo.create({
            content: window.prompt("Todo content"),
        });
    }

    return (
        <main>

            <h1 className="text-white text-3xl font-bold mb-4">My todos</h1>
            <button
                className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
                onClick={createTodo}
            >
                + new
            </button>
            <ul className="mb-4">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        onClick={() => deleteTodo(todo.id)}
                        className="cursor-pointer hover:line-through"
                    >
                        {todo.content}
                    </li>
                ))}
            </ul>
            <div className="mb-4">
                🥳 App successfully hosted. Try creating a new todo.
                <br />
                <a
                    className="underline text-blue-400"
                    href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/"
                >
                    Review next steps of this tutorial.
                </a>
            </div>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded mb-4"
                onClick={signOut}
            >
                Sign out
            </button>
            <h2 className="text-white font-semibold">
                {user?.signInDetails?.loginId}'s todos
            </h2>


        </main>

    );
}
