import React from 'react'

const CardChapter = props => {

    const trigger = () => {
        props.onClickEdit({editMode: true, id: props.id})
    }

    return (
        <div
            className="chapters"
            onClick={trigger}>
            {props.title}
        </div>
    )
}

export default CardChapter
