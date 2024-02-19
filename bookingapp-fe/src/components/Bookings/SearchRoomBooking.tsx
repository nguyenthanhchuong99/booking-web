import { Input, AutoComplete, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './Booking.css';
interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

interface AutocompleteProps {
  options: Room[];
  onSelect: (roomId: number) => void;
}

const SearchRoomBooking: React.FC<AutocompleteProps> = ({
  options,
  onSelect,
}) => {
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    const filteredRooms = options.filter(room =>
      room.room_name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredRooms);
    setSearchValue(value);
  };

  const handleSelect = (roomId: string) => {
    const selectedRoom = options.find(
      room => room.room_id === parseInt(roomId)
    );
    if (selectedRoom) {
      const roomName = selectedRoom.room_name;
      onSelect(parseInt(roomId));
      setSearchValue(roomName);
    }
    setSearchResults([]);
  };

  const renderOption = (room: Room) => ({
    value: room.room_id,
    label: room.room_name,
  });

  return (
    <AutoComplete
      options={searchResults.map(renderOption)}
      onSelect={handleSelect}
      onSearch={handleSearch}
      value={searchValue}
      style={{ width: 300 }}
      allowClear
      autoFocus
    >
      <Input.Search
        enterButton={<Button icon={<SearchOutlined />} />}
        autoComplete='off'
        className='input-search-name'
        placeholder='Input Room Name...'
      />
    </AutoComplete>
  );
};

export default SearchRoomBooking;
