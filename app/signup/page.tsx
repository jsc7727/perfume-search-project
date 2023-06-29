'use client';
import React, { useState } from 'react';
import Logo from '@/public/logo.svg';
import Image from 'next/image';
import LabelInput from '@/components/common/LabelInput';
import Button from '@/components/common/Button';

function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center border-1 border-stone-300 rounded w-[458px] px-7 py-10 gap-8">
        <Image src={Logo} alt="logo" width={208} height={34} />
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <LabelInput
              label="아이디"
              state={email}
              setState={setEmail}
              placeholder="이메일을 입력해주세요."
              type="email"
            />
          </div>
          <div className="flex items-center mb-4">
            <LabelInput
              label="비밀번호"
              state={password}
              setState={setPassword}
              placeholder="비밀번호를 입력해주세요."
              type="password"
            />
          </div>
          <Button text="회원가입" />
        </form>
      </div>
    </div>
  );
}

export default Page;
