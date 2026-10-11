import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode }) {

    return (
        <div className="w-full rounded-lg overflow-hidden border border-gray-700">

            <Editor
                height="500px"
                defaultLanguage="java"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                    minimap: {
                        enabled: false
                    },
                    fontSize: 15,
                    automaticLayout: true,
                    scrollBeyondLastLine: false
                }}
            />

        </div>
    );
}

export default CodeEditor;