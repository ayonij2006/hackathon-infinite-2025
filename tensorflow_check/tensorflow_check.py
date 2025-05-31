import tensorflow as tf

def run_tensorflow_check():
    tf_info = {
        "tensorflow_version": tf.__version__,
        "num_gpus": len(tf.config.list_physical_devices('GPU')),
    }

    # Simple matrix multiplication
    a = tf.constant([[1.0, 2.0]])
    b = tf.constant([[3.0], [4.0]])
    result = tf.matmul(a, b)

    tf_info["matrix_multiplication_result"] = result.numpy().tolist()
    return tf_info
