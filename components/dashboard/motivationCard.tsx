'use client';
import React, { useEffect, useState } from "react";

const quotes = [
  {
    title: "“Believe you can and you're halfway there.”",
    author: "— Theodore Roosevelt",
  },
  {
    title: "“The best way to predict the future is to create it.”",
    author: "— Peter Drucker",
  },
  {
    title: "“Dream big and dare to fail.”",
    author: "— Norman Vaughan",
  },
  {
    title: "“Strive not to be a success, but rather to be of value.”",
    author: "— Albert Einstein",
  },
  {
    title: "“Your time is limited, so don’t waste it living someone else’s life.”",
    author: "— Steve Jobs",
  },
];

const QuoteCard = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);

  return (
    <div
  className="hidden md:block w-[380px] h-[220px] rounded-xl overflow-hidden relative text-white shadow-lg"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1483389127117-b6a2102724ae?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fA%3D%3D')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute inset-0 bg-opacity-60" />
  <div className="relative z-10 h-full flex flex-col justify-center p-5">
    <h2 className="text-lg font-semibold mb-2">{quote.title}</h2>
    <p className="text-sm text-gray-200">{quote.author}</p>
  </div>
</div>

  );
};

export default QuoteCard;
