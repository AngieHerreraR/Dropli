import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function MathGame({ onWin }: { onWin: () => void }) {
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState({ num1: 0, num2: 0, op: '+', answer: 0, options: [] as number[] });

  const generateProblem = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;
    
    if (op === '-') {
      if (num1 < num2) [num1, num2] = [num2, num1]; // avoid negative answers
    } else if (op === '*') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    }

    let answer = 0;
    if (op === '+') answer = num1 + num2;
    if (op === '-') answer = num1 - num2;
    if (op === '*') answer = num1 * num2;

    const options = new Set<number>();
    options.add(answer);
    while(options.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const fake = answer + offset;
      if (fake !== answer && fake >= 0) options.add(fake);
    }

    setProblem({ 
      num1, 
      num2, 
      op, 
      answer, 
      options: Array.from(options).sort(() => Math.random() - 0.5) 
    });
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleAnswer = (opt: number) => {
    if (opt === problem.answer) {
      const newScore = score + 10;
      if (newScore >= 100) {
        setScore(100);
        setTimeout(onWin, 300);
      } else {
        setScore(newScore);
        generateProblem();
      }
    } else {
      setScore(s => Math.max(0, s - 15));
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[280px] mx-auto space-y-8">
      <div className="text-3xl font-bold text-blue-600 bg-white px-6 py-2 rounded-full shadow-sm">
        {score}%
      </div>
      
      <div className="text-5xl sm:text-6xl font-bold text-gray-800 tracking-widest bg-white w-full py-8 rounded-3xl shadow-sm text-center">
        {problem.num1} {problem.op} {problem.num2}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {problem.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(opt)}
            className="py-6 sm:py-8 bg-blue-100 text-blue-700 text-2xl sm:text-3xl font-bold rounded-3xl shadow-sm hover:bg-blue-200 transition-colors"
          >
            {opt}
          </motion.button>
        ))}
      </div>
      
      <p className="text-sm text-gray-500 text-center px-4">
        Resuelve la operación para ganar puntos.
      </p>
    </div>
  );
}
