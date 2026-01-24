import React, { useState } from 'react';
import { FileCode, X } from 'lucide-react';

interface Template {
    id: string;
    name: string;
    language: string;
    code: string;
    description: string;
}

const templates: Template[] = [
    {
        id: 'java-array',
        name: 'Array Template',
        language: 'java',
        description: 'Basic array manipulation template',
        code: `public class Solution {
    public static void main(String[] args) {
        int[] arr = new int[]{1, 2, 3, 4, 5};
        
        // Your code here
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}`
    },
    {
        id: 'java-bfs',
        name: 'BFS Template',
        language: 'java',
        description: 'Breadth-First Search template',
        code: `import java.util.*;

public class Solution {
    public void bfs(int start, List<List<Integer>> graph) {
        Queue<Integer> queue = new LinkedList<>();
        boolean[] visited = new boolean[graph.size()];
        
        queue.offer(start);
        visited[start] = true;
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            System.out.println("Visiting: " + node);
            
            for (int neighbor : graph.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
    }
}`
    },
    {
        id: 'python-dp',
        name: 'DP Template',
        language: 'python',
        description: 'Dynamic Programming template',
        code: `def solve(n):
    # Initialize DP array
    dp = [0] * (n + 1)
    dp[0] = 1  # Base case
    
    # Fill DP table
    for i in range(1, n + 1):
        # Your DP logic here
        dp[i] = dp[i - 1]
    
    return dp[n]

# Test
print(solve(5))`
    },
    {
        id: 'cpp-sorting',
        name: 'Sorting Template',
        language: 'cpp',
        description: 'Common sorting algorithms',
        code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> arr = {5, 2, 8, 1, 9};
    
    // Sort ascending
    sort(arr.begin(), arr.end());
    
    // Sort descending
    sort(arr.begin(), arr.end(), greater<int>());
    
    for (int x : arr) {
        cout << x << " ";
    }
    
    return 0;
}`
    }
];

interface CodeTemplatesProps {
    onSelectTemplate: (code: string, language: string) => void;
}

const CodeTemplates: React.FC<CodeTemplatesProps> = ({ onSelectTemplate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (template: Template) => {
        onSelectTemplate(template.code, template.language);
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title="Code Templates"
            >
                <FileCode size={18} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <div className="flex items-center gap-2 text-green-400 font-bold">
                        <FileCode size={20} />
                        <span>Code Templates</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer"
                                onClick={() => handleSelect(template)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white">{template.name}</h3>
                                    <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded">
                                        {template.language.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                                <pre className="bg-gray-950 p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto max-h-32">
                                    {template.code}
                                </pre>
                                <button className="mt-3 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium">
                                    Use Template
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeTemplates;
