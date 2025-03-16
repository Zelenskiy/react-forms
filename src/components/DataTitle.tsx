import { FC } from 'react';
import { FormData } from '../types/types';

interface DataTileProps {
  title: string;
  data: FormData;
  isNew: boolean;
}

const DataTile: FC<DataTileProps> = ({ title, data, isNew }) => {
  return (
    <div
      className={`border rounded-lg p-4 shadow-md transition-all ${isNew ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-gray-200'}`}
    >
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      {!data.name ? (
        <p className="text-gray-500 italic">No data submitted yet</p>
      ) : (
        <div className="space-y-2">
          <p>
            <span className="font-medium">Name:</span> {data.name}
          </p>
          <p>
            <span className="font-medium">Age:</span> {data.age}
          </p>
          <p>
            <span className="font-medium">Email:</span> {data.email}
          </p>
          <p>
            <span className="font-medium">Gender:</span> {data.gender}
          </p>
          <p>
            <span className="font-medium">Terms & Conditions:</span>{' '}
            {data.termsAccepted ? 'Accepted' : 'Not Accepted'}
          </p>
          <p>
            <span className="font-medium">Country:</span> {data.country}
          </p>

          {data.image && (
            <div className="mt-3">
              <p className="font-medium mb-1">Image:</p>
              <img
                src={data.image}
                alt="Uploaded"
                className="max-w-full h-auto max-h-40 rounded border"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTile;
