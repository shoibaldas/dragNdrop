import { useEffect, useState } from 'react';
import './App.css';
import { AiFillDelete } from "react-icons/ai";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useDebounce from './hooks/useDebounce';

function App() {
  const [embeds, setEmbeds] = useState(() => {
    const storedEmbeds = localStorage.getItem('embeds');
    return storedEmbeds ? JSON.parse(storedEmbeds) : [];
  });

  const debouncedEmbeds = useDebounce(embeds, 10000);

  const [idOrder, setIdOrder] = useState(debouncedEmbeds.map((embed) => embed.id));

  useEffect(() => {
    if (debouncedEmbeds !== undefined) {
      localStorage.setItem('embeds', JSON.stringify(debouncedEmbeds));
    }
  }, [debouncedEmbeds]);

  const addEmbed = () => {
    const newEmbed = {
      id: Date.now(),
    };
    setEmbeds((prevEmbeds) => [...prevEmbeds, newEmbed]);
  };

  const deleteEmbed = (id) => {
    const updatedEmbeds = debouncedEmbeds.filter((embed) => embed.id !== id);
    setEmbeds(updatedEmbeds);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(debouncedEmbeds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEmbeds(items);

    //show updated array
    const newIdOrder = items.map((embed) => embed.id);
    setIdOrder(newIdOrder);

    console.log('Updated ID Order:', newIdOrder);
  };

  return (
    <div className='card-body'>
      <button onClick={addEmbed}>Add Embed</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="embeds">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {debouncedEmbeds.map((embed, index) => (
                <Draggable key={embed.id.toString()} draggableId={embed.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      className='embedStyle'
                    >
                      <span
                        onClick={() => deleteEmbed(embed.id)}
                        className='deleteIconStyle'
                        title="Delete"
                      >
                        <AiFillDelete></AiFillDelete>
                      </span>
                      <h4 className='label'>Name</h4>
                      <input
                        type="text"
                        placeholder="Text Input"
                        className='inputStyle'
                      />
                      <h4 className='label'>Embed Code</h4>
                      <textarea
                        placeholder="Text Area"
                        className='textAreaStyle'
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
