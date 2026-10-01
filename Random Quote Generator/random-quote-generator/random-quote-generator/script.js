(() => {
  const quotes = [
    {
      { t: "Arise, awake, and do not stop until the goal is reached.", a: "Swami Vivekananda" },

      { t: "All power is within you; you can do anything and everything.", a: "Swami Vivekananda" },

      { t: "Strength is life, weakness is death.", a: "Swami Vivekananda" },

      { t: "They alone live who live for others; the rest are more dead than alive.", a: "Swami Vivekananda" },

      { t: "Take up one idea. Make that one idea your life.", a: "Swami Vivekananda" },

      { t: "You have to grow from the inside out.", a: "Swami Vivekananda" },

      { t: "Truth can be stated in a thousand different ways, yet each one can be true.", a: "Swami Vivekananda" },

      { t: "The world is the great gymnasium where we come to make ourselves strong.", a: "Swami Vivekananda" },

      { t: "Whatever you think, that you will be.", a: "Swami Vivekananda" },

      { t: "Stand up, be bold, be strong. Take the whole responsibility on your own shoulders.", a: "Swami Vivekananda" },

      { t: "Condemn none: if you can stretch out a helping hand, do so.", a: "Swami Vivekananda" },

      { t: "You cannot believe in God until you believe in yourself.", a: "Swami Vivekananda" },

      { t: "The motive is the measure of your work.", a: "Swami Vivekananda" },

      { t: "Education is the manifestation of the perfection already in man.", a: "Swami Vivekananda" },

      { t: "Anything that makes you weak physically, intellectually, and spiritually, reject as poison.", a: "Swami Vivekananda" },

      { t: "Live as if you were to die tomorrow. Learn as if you were to live forever.", a: "Mahatma Gandhi" },

      { t: "The future depends on what you do today.", a: "Mahatma Gandhi" },

      { t: "In a gentle way, you can shake the world.", a: "Mahatma Gandhi" },

      { t: "The best way to find yourself is to lose yourself in the service of others.", a: "Mahatma Gandhi" },

      { t: "Strength does not come from physical capacity. It comes from an indomitable will.", a: "Mahatma Gandhi" },

      { t: "Freedom is not worth having if it does not include the freedom to make mistakes.", a: "Mahatma Gandhi" },

      { t: "Earth provides enough to satisfy every man's needs, but not every man's greed.", a: "Mahatma Gandhi" },

      { t: "You must not lose faith in humanity.", a: "Mahatma Gandhi" },

      { t: "An eye for an eye will only make the whole world blind.", a: "Mahatma Gandhi" },

      { t: "To give pleasure to a single heart by a single act is better than a thousand heads bowing in prayer.", a: "Mahatma Gandhi" },

      { t: "You have to dream before your dreams can come true.", a: "A. P. J. Abdul Kalam" },

      { t: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.", a: "A. P. J. Abdul Kalam" },

      { t: "Man needs his difficulties because they are necessary to enjoy success.", a: "A. P. J. Abdul Kalam" },

      { t: "Be more dedicated to making solid achievements than in running after swift and synthetic happiness.", a: "A. P. J. Abdul Kalam" },

      { t: "Thinking should become your capital asset, no matter whatever ups and downs you come across in your life.", a: "A. P. J. Abdul Kalam" },

      { t: "Without your involvement you can't succeed. With your involvement you can't fail.", a: "A. P. J. Abdul Kalam" },

      { t: "All of us do not have equal talent. But all of us have an equal opportunity to develop our talents.", a: "A. P. J. Abdul Kalam" },

      { t: "Great dreams of great dreamers are always transcended.", a: "A. P. J. Abdul Kalam" },

      { t: "Climbing to the top demands strength, whether it is to the top of Mount Everest or to the top of your career.", a: "A. P. J. Abdul Kalam" },

      { t: "Learning gives creativity, creativity leads to thinking, thinking provides knowledge, and knowledge makes you great.", a: "A. P. J. Abdul Kalam" },

      { t: "Cultivation of mind should be the ultimate aim of human existence.", a: "Dr. B. R. Ambedkar" },

      { t: "It is disgraceful to live at the cost of one's self-respect.", a: "Dr. B. R. Ambedkar" },

      { t: "Self-respect is the most vital factor in life.", a: "Dr. B. R. Ambedkar" },

      { t: "It is out of hard and ceaseless struggle alone that one derives strength, confidence and recognition.", a: "Dr. B. R. Ambedkar" },

      { t: "Swaraj is my birthright, and I shall have it.", a: "Bal Gangadhar Tilak" },

      { t: "Manpower without unity is not a strength unless it is harmonized and united properly, then it becomes a spiritual power.", a: "Sardar Vallabhbhai Patel" },

      { t: "Where the mind is without fear and the head is held high.", a: "Rabindranath Tagore" },

      { t: "Where knowledge is free.", a: "Rabindranath Tagore" },

      { t: "Where words come out from the depth of truth.", a: "Rabindranath Tagore" },

      { t: "Where tireless striving stretches its arms towards perfection.", a: "Rabindranath Tagore" },

      { t: "Into that heaven of freedom, my Father, let my country awake.", a: "Rabindranath Tagore" },

      { t: "A moment comes, which comes but rarely in history, when we step out from the old to the new.", a: "Jawaharlal Nehru" },

      { t: "The soul of a nation, long suppressed, finds utterance.", a: "Jawaharlal Nehru" },

      { t: "You cannot change your future, but you can change your habits, and surely your habits will change your future.", a: "A. P. J. Abdul Kalam" }
      { t: "The unexamined life is not worth living.", a: "Socrates" },
     { t: "I think, therefore I am.", a: "René Descartes" },
    { t: "The journey of a thousand miles begins with a single step.", a: "Lao Tzu" },
    { t: "Well done is better than well said.", a: "Benjamin Franklin" },
    { t: "Imagination is more important than knowledge.", a: "Albert Einstein" },
    { t: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { t: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", a: "Will Durant" },
    { t: "That which does not kill us makes us stronger.", a: "Friedrich Nietzsche" },
    { t: "The best way to predict the future is to invent it.", a: "Alan Kay" },
    { t: "Talk is cheap. Show me the code.", a: "Linus Torvalds" },
    { t: "Do what you can, with what you have, where you are.", a: "Theodore Roosevelt" },
    { t: "Courage is grace under pressure.", a: "Ernest Hemingway" },
    { t: "Not all those who wander are lost.", a: "J.R.R. Tolkien" },
    { t: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    { t: "Fall seven times, stand up eight.", a: "Japanese proverb" },
    { t: "No one can make you feel inferior without your consent.", a: "Eleanor Roosevelt" },
    { t: "Genius is one percent inspiration and ninety-nine percent perspiration.", a: "Thomas Edison" },
    { t: "If I have seen further, it is by standing on the shoulders of giants.", a: "Isaac Newton" },
    { t: "The only thing we have to fear is fear itself.", a: "Franklin D. Roosevelt" },
    { t: "Turn your wounds into wisdom.", a: "Oprah Winfrey" },
  ];

  const content = document.getElementById("content");
  const quoteEl = document.getElementById("quote");
  const authorEl = document.getElementById("author");
  const btn = document.getElementById("newBtn");

  // Shuffle bag: every quote appears once before any repeats,
  // and the same quote never shows twice in a row.
  let bag = [], last = -1, busy = false;
  function nextIndex() {
    if (!bag.length) {
      bag = quotes.map((_, i) => i);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag[bag.length - 1] === last) bag.unshift(bag.pop());
    }
    return (last = bag.pop());
  }

  function show(i) {
    quoteEl.textContent = quotes[i].t;
    authorEl.textContent = quotes[i].a;
  }

  function change() {
    if (busy) return;
    busy = true;
    content.classList.add("out");
    setTimeout(() => {
      show(nextIndex());
      content.classList.remove("out");
      content.classList.add("pre");
      void content.offsetWidth;
      content.classList.remove("pre");
      setTimeout(() => (busy = false), 300);
    }, 300);
  }

  show(nextIndex());
  btn.addEventListener("click", change);
  document.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && e.target === document.body) {
      e.preventDefault();
      change();
    }
  });
})();
