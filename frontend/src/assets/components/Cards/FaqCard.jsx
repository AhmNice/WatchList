import { Minus, Plus } from 'lucide-react'
import React from 'react'
import { useState } from 'react';

const FaqCard = ({index, question}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
   <div className="faqCard flex gap-4 w-full h-max py-5 self-start cursor-pointer " onClick={toggleOpen}>
      <div className="faq flex gap-5">
        <div className="num px-4 py-3 text-white rounded-md flex items-center justify-center">{index}</div>
      </div>
      <div className="question_ans flex flex-col gap-4 w-full">
        <div className="question text-white flex w-full items-center justify-between">
          <p className='Manrope-Medium'>{question.question}</p>
          <div className='text-white text-base cursor-pointer' onClick={toggleOpen}>
            {isOpen ? <Minus /> : <Plus />}
          </div>
        </div>
        {isOpen && (
          <div className="answer Manrope-Regular text-base text-gray-500">
            {question.answer}
          </div>
        )}
      </div>
    </div>
  )
}

export default FaqCard
