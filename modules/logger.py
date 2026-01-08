import os
import logging
from icecream import ic

# Configure logging to a file
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("server.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("amazon-clone")

# Configure icecream to use the logger
def icecream_to_logging(text):
    logger.info(f"IC: {text}")

ic.configureOutput(outputFunction=icecream_to_logging)
