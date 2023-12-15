'use client'

import { revalidatePath } from "next/cache";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  email: string
  utility: string
}

interface Props {
  setId: (id: number) => void;
}
const GettingStarted = ({ setId }: Props): JSX.Element => {
  
  // useEffect(() => {
  //   // Save a value to localStorage
  //   console.log(`saving id ${id} to localStorage`);
  //   // Also saving to state for ease of use on Dashboard
  //   // id && setCustomerId(id);
  //   id && localStorage.setItem('customerId', id.toString());
  // }, [id]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, utility } = data;
    const response = await fetch('/api/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, utility }),
    });

    const resData = await response.json();

    const { link, id } = resData;
    setId(id)
    window.open(link, '_blank')
    console.log({link, id});
    localStorage.setItem('customerId', id.toString())
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-30 w-auto"
          src="/GreenPulse.png"
          alt="Green Pulse logo"
        />
        
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10  text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Get Started by providing your Email and Utility Company name:
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
            </div>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="utility" className="block text-sm font-medium leading-6 text-gray-900">
                Utility Company Name
              </label>
            </div>
            <div className="mt-2">
              <input
                id="utility"
                {...register("utility")}
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

  )
}


export default GettingStarted;