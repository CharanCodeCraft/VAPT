'use client';
import { useRouter } from 'next/navigation';

export default function StudentCard({ student, currentStudentId }) {
  const router = useRouter();

  const viewProfile = () => {
    router.push(`/profile/${student._id}?requestorid=${currentStudentId}`);
  };

  return (
    <div 
      onClick={viewProfile}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-6 border border-gray-200"
    >
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
          {student.profileImage ? (
            <img 
              src={student.profileImage} 
              alt={student.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg 
              className="w-16 h-16 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
          {student.name}
        </h3>
        
        <p className="text-sm text-blue-600 font-medium mb-1">
          {student.usn}
        </p>
        
        <p className="text-xs text-gray-500 mb-3">
          {student.department || 'N/A'}
        </p>
        
        <div className="w-full pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center font-mono">
            ID: {student._id.substring(0, 8)}...
          </p>
        </div>
      </div>
    </div>
  );
}
