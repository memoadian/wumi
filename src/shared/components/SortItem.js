import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { mdiDragVariant } from '@mdi/js'
import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'
import './SortItem.css'

const style = {
    backgroundColor: '#f6f6f6',
    cursor: 'move',
    margin: '30px 0'
};

const SortItem = ({id, index, moveCard, children}) => {
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;

    drag(drop(ref));

    return (
        <div 
            style={{...style, opacity}} 
            className="sortitem" 
            data-handler-id={handlerId} 
            ref={ref} >
            <div className="columns">
                <div className="gray">
                    <Icon 
                        className="icon"
                        path={mdiDragVariant}
                        size={0.8}
                        vertical
                        rotate={180}/>
                </div>
                <div className="column">
                    {children}
                </div>
                <div className="column is-2">
                    <span className="close">
                        <Icon 
                            className="icon"
                            path={mdiClose}
                            size={0.8}
                            vertical
                            rotate={180}/>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SortItem