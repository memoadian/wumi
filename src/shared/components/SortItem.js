import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { mdiDragVariant } from '@mdi/js'
import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'
import './SortItem.css'

const style = {
    backgroundColor: '#f6f6f6',
    cursor: 'move',
    margin: '30px 0'
}

const SortItem = ({id, index, moveCard, children, onClickRemove}) => {
    const ref = useRef(null)
    const handleClose = () => {
        onClickRemove({id: id})
    }

    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) { return }

            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) { return }

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) { return }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) { return }

            moveCard(dragIndex, hoverIndex)
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: () => {
            return { id, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1

    drag(drop(ref))

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
                            onClick={handleClose}
                            rotate={180}/>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SortItem