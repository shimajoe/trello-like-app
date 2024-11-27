import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import dummyData from "../dummyData";
import Card from "./Card";

const Main = () => {
  const [data, setData] = React.useState(dummyData);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // 別のカラムにタスクが移動した場合
    if (source.droppableId !== destination.droppableId) {
      // 一旦同じカラム内でのタスクの入れ替え
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const destinationColIndex = data.findIndex((e) => e.id === destination.droppableId);
      const sourceCol = data[sourceColIndex];
      const destinationCol = data[destinationColIndex];
      // 破壊的なので配列をコピー
      const sourceTasks = [...sourceCol.tasks];
      const destinationTasks = [...destinationCol.tasks];
      // 動かし始めたカラムからタスクを削除
      const [removed] = sourceTasks.splice(source.index, 1);
      // 動かした後のカラムにタスクを追加
      destinationTasks.splice(destination.index, 0, removed);
      // 元に戻す
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
      setData(data);
    } else {
      // 一旦同じカラム内でのタスクの入れ替え
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const sourceCol = data[sourceColIndex];
      // slice()→破壊的
      const sourceTasks = [...sourceCol.tasks];
      // タスクを削除
      const [removed] = sourceTasks.splice(source.index, 1);
      // タスクを追加
      sourceTasks.splice(destination.index, 0, removed);
      // 元に戻す
      data[sourceColIndex].tasks = sourceTasks;
      setData(data);
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="trello">
        {data.map((section)=> (
          <Droppable key={section.id} droppableId={section.id}>
            {(provided) => (
              <div
               className="trello-section" 
               ref={provided.innerRef}
               {...provided.droppableProps}
              >
                <div className="trello-section-title">{section.title}</div>
                <div className="trello-section-content">
                  {section.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.5 : 1,
                          }}
                        >
                          <Card>{task.title}</Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {/* 伸び縮み */}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>);
};

export default Main;