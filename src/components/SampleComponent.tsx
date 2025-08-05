import React from 'react'

interface SampleComponentProps {
  title?: string
  children?: React.ReactNode
}

export const SampleComponent: React.FC<SampleComponentProps> = ({ 
  title = "Sample Component", 
  children 
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Tailwind CSS Test
          </div>
          <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
            {title}
          </h2>
          <p className="mt-2 text-slate-500">
            This component demonstrates that Tailwind CSS is working correctly with the project setup.
          </p>
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SampleComponent 